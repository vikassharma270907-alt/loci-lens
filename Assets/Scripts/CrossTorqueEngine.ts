/**
 * CrossTorqueEngine.ts
 * Pure TypeScript deterministic domain engine for CrossTorque AR.
 * Zero Lens Studio runtime dependencies — imported directly by CrossTorqueController.ts
 * and CrossTorqueLeafScenarios.ts so domain math and UI state can never drift.
 */

export type PassIndex = 1 | 2 | 3;
export type FlangeVerdictStatus = "NOMINAL" | "WARP_REJECTED" | "CREEP_ALERT" | "SEAL_VERIFIED";

export interface BoltState {
  readonly id: number; // 1 to 5
  readonly angleDeg: number; // 90, 18, -54, -126, 162 (pentagonal wheel/flange layout)
  readonly localXCm: number;
  readonly localYCm: number;
  appliedTorqueNm: number;
  completedPass: number; // 0, 1, 2, or 3
  hasCreepAlert: boolean;
}

export interface TorqueStepResult {
  readonly accepted: boolean;
  readonly status: FlangeVerdictStatus;
  readonly targetBoltId: number;
  readonly attemptedBoltId: number;
  readonly currentPass: PassIndex;
  readonly targetTorqueNm: number;
  readonly completedSteps: number; // 0 to 15
  readonly totalSteps: number; // 15
  readonly flangeWarpMm: number;
  readonly mistakeCount: number;
  readonly focusMode: boolean;
  readonly isComplete: boolean;
  readonly bannerText: string;
  readonly verdictText: string;
  readonly debriefText: string;
}

/**
 * Standard 5-bolt star sequence (ASME PCC-1 & SAE wheel/flange pattern):
 * Bolt 1 (Top) -> Bolt 3 (Lower-Right) -> Bolt 5 (Upper-Left) -> Bolt 2 (Upper-Right) -> Bolt 4 (Lower-Left)
 */
export const STAR_SEQUENCE_ORDER: readonly number[] = [1, 3, 5, 2, 4];

/**
 * Three-stage progressive torque pass specifications (Nm):
 * Pass 1: 35 Nm (30% Snug seating)
 * Pass 2: 75 Nm (70% Intermediate elastic preload)
 * Pass 3: 110 Nm (100% Final specification lock)
 */
export const PASS_TORQUE_TARGETS_NM: Readonly<Record<PassIndex, number>> = {
  1: 35,
  2: 75,
  3: 110,
};

export const PASS_LABELS: Readonly<Record<PassIndex, string>> = {
  1: "SNUG",
  2: "INTERMEDIATE",
  3: "FINAL LOCK",
};

export const HUB_RADIUS_CM = 11.0;
export const HUB_CENTER_Y_CM = -8.0;
export const HUB_DEPTH_Z_CM = -110.0;
export const MAX_SAFE_WARP_MM = 0.05;

export class CrossTorqueEngine {
  private bolts: BoltState[] = [];
  private currentPass: PassIndex = 1;
  private sequenceCursor: number = 0; // 0..4 index into STAR_SEQUENCE_ORDER
  private completedSteps: number = 0; // 0..15
  private mistakeCount: number = 0;
  private focusMode: boolean = false;
  private flangeWarpMm: number = 0.02;
  private lastStatus: FlangeVerdictStatus = "NOMINAL";
  private lastVerdictText: string = "NOMINAL · RUNOUT 0.02 mm · TORQUE BOLT #1 (35 Nm)";

  constructor() {
    this.reset();
  }

  /**
   * Resets the 5-bolt assembly to Pass 1, Step 0.
   */
  public reset(): TorqueStepResult {
    // Angles in degrees starting from Top (90 deg) clockwise every 72 deg:
    // Bolt 1: 90 deg, Bolt 2: 18 deg, Bolt 3: -54 deg, Bolt 4: -126 deg, Bolt 5: 162 deg
    const anglesDeg = [90, 18, -54, -126, 162];
    this.bolts = anglesDeg.map((deg, idx) => {
      const rad = (deg * Math.PI) / 180.0;
      const x = Number((HUB_RADIUS_CM * Math.cos(rad)).toFixed(1));
      const y = Number((HUB_CENTER_Y_CM + HUB_RADIUS_CM * Math.sin(rad)).toFixed(1));
      return {
        id: idx + 1,
        angleDeg: deg,
        localXCm: x,
        localYCm: y,
        appliedTorqueNm: 0,
        completedPass: 0,
        hasCreepAlert: false,
      };
    });
    this.currentPass = 1;
    this.sequenceCursor = 0;
    this.completedSteps = 0;
    this.mistakeCount = 0;
    this.focusMode = false;
    this.flangeWarpMm = 0.02;
    this.lastStatus = "NOMINAL";
    this.lastVerdictText = "NOMINAL · RUNOUT 0.02 mm · TORQUE BOLT #1 (35 Nm)";
    return this.getSnapshot(1, true);
  }

  public getBolts(): ReadonlyArray<Readonly<BoltState>> {
    return this.bolts;
  }

  public getBoltById(boltId: number): Readonly<BoltState> {
    const found = this.bolts.find((b) => b.id === boltId);
    if (!found) {
      throw new Error(`Invalid boltId: ${boltId}`);
    }
    return found;
  }

  public getActiveTargetBoltId(): number {
    if (this.isComplete()) {
      return 0;
    }
    return STAR_SEQUENCE_ORDER[this.sequenceCursor];
  }

  public getPreviousBoltId(): number {
    if (this.completedSteps === 0) {
      return STAR_SEQUENCE_ORDER[0];
    }
    const prevIdx = (this.sequenceCursor + STAR_SEQUENCE_ORDER.length - 1) % STAR_SEQUENCE_ORDER.length;
    return STAR_SEQUENCE_ORDER[prevIdx];
  }

  public isComplete(): boolean {
    return this.completedSteps >= 15;
  }

  public isFocusMode(): boolean {
    return this.focusMode;
  }

  public toggleFocusMode(): TorqueStepResult {
    this.focusMode = !this.focusMode;
    const activeId = this.getActiveTargetBoltId();
    if (this.focusMode && activeId > 0) {
      this.lastVerdictText = `FOCUS MODE · EYES ON BOLT #${activeId}`;
    } else if (!this.focusMode && activeId > 0) {
      this.lastVerdictText = `NOMINAL · RUNOUT ${this.flangeWarpMm.toFixed(2)} mm · TORQUE BOLT #${activeId} (${PASS_TORQUE_TARGETS_NM[this.currentPass]} Nm)`;
    }
    return this.getSnapshot(activeId, true);
  }

  /**
   * Applies torque to the specified boltId.
   * Validates whether boltId matches the required star-sequence bolt.
   * If out of sequence (e.g., adjacent bolt), computes asymmetric clamping warp tilt (mm),
   * increments mistakeCount, rejects state advancement, and explains the mechanical error.
   */
  public applyBoltTorque(boltId: number): TorqueStepResult {
    if (this.isComplete()) {
      return this.getSnapshot(0, false);
    }
    const expectedBoltId = this.getActiveTargetBoltId();
    const targetNm = PASS_TORQUE_TARGETS_NM[this.currentPass];

    if (boltId !== expectedBoltId) {
      this.mistakeCount += 1;
      this.flangeWarpMm = this.computeAsymmetricWarpMm(boltId, expectedBoltId, targetNm);
      this.lastStatus = "WARP_REJECTED";
      this.lastVerdictText = `BLOCKED: ADJACENT BOLT #${boltId} CAUSES +${this.flangeWarpMm.toFixed(2)} mm WARP — TORQUE #${expectedBoltId} NEXT`;
      return this.getSnapshot(boltId, false);
    }

    // Valid star-sequence bolt tightened
    const bolt = this.bolts[boltId - 1];
    bolt.appliedTorqueNm = targetNm;
    bolt.completedPass = this.currentPass;
    bolt.hasCreepAlert = false;

    this.completedSteps += 1;
    this.flangeWarpMm = 0.02;
    this.lastStatus = this.isComplete() ? "SEAL_VERIFIED" : "NOMINAL";

    if (this.isComplete()) {
      this.focusMode = false;
      this.lastVerdictText = `SEAL VERIFIED · 5/5 BOLTS @ 110 Nm · RUNOUT 0.02 mm`;
      return this.getSnapshot(boltId, true);
    }

    // Advance cursor within current pass or transition to next pass
    this.sequenceCursor += 1;
    if (this.sequenceCursor >= STAR_SEQUENCE_ORDER.length) {
      this.sequenceCursor = 0;
      if (this.currentPass < 3) {
        this.currentPass = (this.currentPass + 1) as PassIndex;
      }
    }

    const nextTargetId = this.getActiveTargetBoltId();
    const nextTargetNm = PASS_TORQUE_TARGETS_NM[this.currentPass];
    if (this.focusMode) {
      this.lastVerdictText = `FOCUS MODE · EYES ON BOLT #${nextTargetId}`;
    } else {
      this.lastVerdictText = `NOMINAL · RUNOUT 0.02 mm · TORQUE BOLT #${nextTargetId} (${nextTargetNm} Nm)`;
    }

    return this.getSnapshot(boltId, true);
  }

  /**
   * Simulates an adjacent out-of-sequence bolt pull for preview stand-in testing.
   */
  public triggerSimulatedAdjacentError(): TorqueStepResult {
    const expectedId = this.getActiveTargetBoltId();
    if (expectedId === 0) {
      return this.getSnapshot(0, false);
    }
    // Pick the immediate clockwise neighbor (adjacent bolt instead of star-opposite)
    const adjacentBoltId = (expectedId % 5) + 1;
    return this.applyBoltTorque(adjacentBoltId);
  }

  /**
   * Simulates elastic bolt-interaction preload relaxation (creep) on a specific bolt
   * (defaulting to Bolt #3 on the lower-right perimeter) for off-axis spatial alert testing.
   */
  public triggerBoltCreepAlert(boltId: number = 3): TorqueStepResult {
    const bolt = this.bolts[boltId - 1];
    bolt.hasCreepAlert = true;
    bolt.appliedTorqueNm = Math.max(0, bolt.appliedTorqueNm - 14);
    this.flangeWarpMm = 0.16;
    this.lastStatus = "CREEP_ALERT";
    this.lastVerdictText = `CREEP ALERT: BOLT #${boltId} RELAXED (-14 Nm) · RE-CHECK BOLT #${boltId}`;
    return this.getSnapshot(boltId, false);
  }

  /**
   * Computes whether the active target bolt lies outside the user's horizontal gaze cone
   * (thresholdDeg defaults to 12.0 degrees inside the +/-16 deg safe preview frame).
   */
  public static computeOffAxisDirection(
    cameraYawDeg: number,
    boltXCm: number,
    boltZCm: number = HUB_DEPTH_Z_CM,
    thresholdDeg: number = 12.0
  ): { isOffAxis: boolean; direction: "LEFT" | "RIGHT" | "CENTER"; angularDeltaDeg: number } {
    const boltAzimuthDeg = (Math.atan2(boltXCm, Math.abs(boltZCm)) * 180.0) / Math.PI;
    const relativeAngleDeg = boltAzimuthDeg + cameraYawDeg;
    if (relativeAngleDeg > thresholdDeg) {
      return { isOffAxis: true, direction: "RIGHT", angularDeltaDeg: Number(relativeAngleDeg.toFixed(1)) };
    }
    if (relativeAngleDeg < -thresholdDeg) {
      return { isOffAxis: true, direction: "LEFT", angularDeltaDeg: Number(relativeAngleDeg.toFixed(1)) };
    }
    return { isOffAxis: false, direction: "CENTER", angularDeltaDeg: Number(relativeAngleDeg.toFixed(1)) };
  }

  /**
   * Deterministic mechanical warp calculation when an out-of-sequence adjacent bolt is tightened.
   */
  private computeAsymmetricWarpMm(attemptedBoltId: number, expectedBoltId: number, passTorqueNm: number): number {
    const bAttempt = this.bolts[attemptedBoltId - 1];
    const bExpected = this.bolts[expectedBoltId - 1];
    const chordDistCm = Math.hypot(bAttempt.localXCm - bExpected.localXCm, bAttempt.localYCm - bExpected.localYCm);
    const rawWarp = 0.18 + (passTorqueNm / 110.0) * 0.18 * (13.0 / Math.max(chordDistCm, 1.0));
    return Number(rawWarp.toFixed(2));
  }

  public getSnapshot(attemptedBoltId: number = this.getActiveTargetBoltId(), accepted: boolean = true): TorqueStepResult {
    const activeId = this.getActiveTargetBoltId();
    const targetNm = PASS_TORQUE_TARGETS_NM[this.currentPass];
    const passLabel = PASS_LABELS[this.currentPass];

    const bannerText = this.isComplete()
      ? "ALL 3 PASSES COMPLETE · 110 Nm LOCKED"
      : this.focusMode
      ? `FOCUS · BOLT #${activeId} (${targetNm} Nm)`
      : `PASS ${this.currentPass} OF 3 · TARGET ${targetNm} Nm (${passLabel})`;

    const debriefText =
      `SEAL VERIFIED · 5/5 BOLTS @ 110 Nm\n` +
      `RUNOUT: ${this.flangeWarpMm.toFixed(2)} mm (MAX 0.05 mm) · ERRORS: ${this.mistakeCount}`;

    return {
      accepted,
      status: this.lastStatus,
      targetBoltId: activeId,
      attemptedBoltId,
      currentPass: this.currentPass,
      targetTorqueNm: targetNm,
      completedSteps: this.completedSteps,
      totalSteps: 15,
      flangeWarpMm: this.flangeWarpMm,
      mistakeCount: this.mistakeCount,
      focusMode: this.focusMode,
      isComplete: this.isComplete(),
      bannerText,
      verdictText: this.lastVerdictText,
      debriefText,
    };
  }
}

/**
 * Self-contained deterministic verification suite (22 unit assertions).
 * Called on startup and by LEAF Scenario 1 to guarantee zero math drift.
 */
export function runCrossTorqueEngineSelfTests(): { passed: number; total: number; failures: string[] } {
  const failures: string[] = [];
  let passed = 0;
  const assert = (condition: boolean, msg: string) => {
    if (condition) {
      passed += 1;
    } else {
      failures.push(msg);
    }
  };

  const engine = new CrossTorqueEngine();
  const init = engine.getSnapshot();
  assert(init.currentPass === 1, "Initial pass must be 1");
  assert(init.targetTorqueNm === 35, "Pass 1 torque must be 35 Nm");
  assert(init.targetBoltId === 1, "Initial star target must be Bolt #1");
  assert(init.flangeWarpMm <= MAX_SAFE_WARP_MM, "Initial warp must be <= 0.05 mm");

  // Step 1: Torque Bolt #1 (Valid)
  const s1 = engine.applyBoltTorque(1);
  assert(s1.accepted === true, "Bolt #1 must be accepted first");
  assert(s1.targetBoltId === 3, "Next star target after Bolt #1 must be Bolt #3");
  assert(engine.getBoltById(1).appliedTorqueNm === 35, "Bolt #1 torque must read 35 Nm");

  // Test Adjacent Mistake: Torque Bolt #2 instead of Bolt #3
  const err = engine.applyBoltTorque(2);
  assert(err.accepted === false, "Adjacent Bolt #2 must be rejected when Bolt #3 is expected");
  assert(err.status === "WARP_REJECTED", "Status must be WARP_REJECTED on adjacent bolt");
  assert(err.flangeWarpMm >= 0.2, "Warp must spike >= 0.20 mm on adjacent bolt tighten");
  assert(err.mistakeCount === 1, "Mistake count must increment to 1");
  assert(err.targetBoltId === 3, "Target bolt must remain locked on Bolt #3 after error");

  // Complete rest of Pass 1: 3 -> 5 -> 2 -> 4
  engine.applyBoltTorque(3);
  engine.applyBoltTorque(5);
  engine.applyBoltTorque(2);
  const p1Done = engine.applyBoltTorque(4);
  assert(p1Done.completedSteps === 5, "Completed steps after Pass 1 must be 5");
  assert(p1Done.currentPass === 2, "Must advance to Pass 2 after 5 star bolts");
  assert(p1Done.targetTorqueNm === 75, "Pass 2 target must be 75 Nm");
  assert(p1Done.targetBoltId === 1, "Pass 2 must restart star sequence at Bolt #1");

  // Off-axis gaze geometry checks
  const centered = CrossTorqueEngine.computeOffAxisDirection(0, 6.5, -110, 12);
  assert(centered.isOffAxis === false, "Bolt #3 (+6.5 cm) must be inside FOV at yaw 0 deg");
  const turnedLeft = CrossTorqueEngine.computeOffAxisDirection(18, 6.5, -110, 12);
  assert(
    turnedLeft.isOffAxis === true && turnedLeft.direction === "RIGHT",
    "Looking 18 deg left must trigger RIGHT edge arrow for Bolt #3"
  );

  // Complete Pass 2 (5 steps) and Pass 3 (5 steps)
  for (const bId of STAR_SEQUENCE_ORDER) {
    engine.applyBoltTorque(bId);
  }
  assert(engine.getSnapshot().currentPass === 3, "Must advance to Pass 3");
  assert(engine.getSnapshot().targetTorqueNm === 110, "Pass 3 target must be 110 Nm");

  for (const bId of STAR_SEQUENCE_ORDER) {
    engine.applyBoltTorque(bId);
  }
  const finalSnap = engine.getSnapshot();
  assert(finalSnap.isComplete === true && finalSnap.completedSteps === 15, "All 15 steps must complete");
  assert(finalSnap.status === "SEAL_VERIFIED", "Final status must be SEAL_VERIFIED");

  return { passed, total: passed + failures.length, failures };
}
