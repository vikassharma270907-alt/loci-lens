/**
 * TorqueLock AR — SequenceEngine.ts
 * Pure TypeScript Mechanical & LOD State Engine (Zero Lens Studio Scene Dependencies).
 *
 * SAFETY & VALIDITY NOTICE:
 * All numeric torque values (35 Nm, 70 Nm, 100 Nm) and the gasket-warp deflection
 * model are strictly illustrative training simulation stand-ins. They do not model
 * non-linear fastener elongation, lubrication variance, or physical flange strain,
 * and MUST NOT be used as real-world pressure-boundary engineering guidance (ASME PCC-1).
 */

export type UIPhaseLOD = "COMPREHENSION" | "PSYCHOMOTOR" | "WARP_ALERT";

export interface BoltPositionCm {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface BoltState {
  readonly id: number; // 1 to 6
  readonly angleDeg: number;
  readonly positionCm: BoltPositionCm;
  currentTorqueNm: number;
  passCompleted: number; // 0, 1, 2, or 3
}

export interface FlangeSnapshot {
  readonly passIndex: number; // 1, 2, or 3
  readonly stepInPass: number; // 1 to 6
  readonly activeBoltId: number; // Current expected bolt in star pattern
  readonly targetTorqueNm: number; // 35, 70, or 100
  readonly focusModeEnabled: boolean;
  readonly lodPhase: UIPhaseLOD;
  readonly maxGasketWarpMm: number;
  readonly warpedBoltId: number | null;
  readonly isFlangeSealed: boolean;
  readonly specTagText: string;
  readonly warpBannerText: string;
  readonly bolts: readonly BoltState[];
}

export class TorqueEngine {
  public static readonly STAR_ORDER: readonly number[] = [1, 4, 2, 5, 3, 6];
  public static readonly PASS_TARGETS_NM: readonly number[] = [35, 70, 100];
  public static readonly PASS_LABELS: readonly string[] = ["SNUG", "INTERMEDIATE", "FINAL SPEC"];
  public static readonly GASKET_WARP_COEFF = 0.0514; // 35 Nm imbalance -> 1.80 mm warp (illustrative simulation)

  public static readonly BOLT_COORDS: readonly BoltPositionCm[] = Object.freeze([
    { x: 0, y: -14, z: -130.0 }, // Bolt 1 (12 o'clock)
    { x: 13, y: -14, z: -122.5 }, // Bolt 2 (2 o'clock)
    { x: 13, y: -14, z: -107.5 }, // Bolt 3 (4 o'clock)
    { x: 0, y: -14, z: -100.0 }, // Bolt 4 (6 o'clock)
    { x: -13, y: -14, z: -107.5 }, // Bolt 5 (8 o'clock)
    { x: -13, y: -14, z: -122.5 } // Bolt 6 (10 o'clock)
  ]);

  private passIndex: number = 1;
  private starCursor: number = 0; // 0..5 index into STAR_ORDER
  private focusMode: boolean = false;
  private lodPhase: UIPhaseLOD = "COMPREHENSION";
  private warpedBoltId: number | null = null;
  private isSealed: boolean = false;
  private bolts: BoltState[] = [];

  constructor() {
    this.reset();
  }

  /**
   * Resets the entire sequence engine to Pass 1, Bolt 1, nominal alignment.
   */
  public reset(): FlangeSnapshot {
    this.passIndex = 1;
    this.starCursor = 0;
    this.focusMode = false;
    this.lodPhase = "COMPREHENSION";
    this.warpedBoltId = null;
    this.isSealed = false;

    this.bolts = TorqueEngine.BOLT_COORDS.map((pos, idx) => ({
      id: idx + 1,
      angleDeg: idx * 60,
      positionCm: { ...pos },
      currentTorqueNm: 0,
      passCompleted: 0
    }));

    return this.getSnapshot();
  }

  /**
   * Toggles Focus Mode (Henderson & Feiner psychomotor LOD reduction).
   * Collapses 2-line comprehension tag into a 1-line eyes-up status pill.
   */
  public toggleFocusMode(): FlangeSnapshot {
    this.focusMode = !this.focusMode;
    return this.getSnapshot();
  }

  /**
   * Advances the active star-pattern bolt or relieves an out-of-sequence error.
   */
  public applyTorqueToActiveOrRelieve(): FlangeSnapshot {
    if (this.warpedBoltId !== null) {
      return this.recoverFromSequenceError();
    }
    if (this.isSealed) {
      return this.getSnapshot();
    }
    const expectedBoltId = TorqueEngine.STAR_ORDER[this.starCursor];
    return this.torqueSpecificBolt(expectedBoltId);
  }

  /**
   * Alias for applyTorqueToActiveOrRelieve, providing direct domain semantics.
   */
  public advanceCorrectStep(): FlangeSnapshot {
    return this.applyTorqueToActiveOrRelieve();
  }

  /**
   * Simulates an out-of-sequence bolt selection to trigger the gasket warp alert.
   */
  public simulateWrongBolt(wrongBoltId?: number): FlangeSnapshot {
    const activeId = TorqueEngine.STAR_ORDER[this.starCursor];
    const candidateId = wrongBoltId !== undefined ? wrongBoltId : (activeId === 2 ? 3 : 2);
    return this.torqueSpecificBolt(candidateId);
  }

  /**
   * Simulates torquing the wrong bolt (alias matching blueprint spec).
   */
  public simulateWrongBoltError(): FlangeSnapshot {
    return this.simulateWrongBolt();
  }

  /**
   * Relieves the improperly torqued bolt back to its previous pass level, restoring nominal state.
   */
  public recoverFromSequenceError(): FlangeSnapshot {
    if (this.warpedBoltId !== null) {
      const badBolt = this.bolts[this.warpedBoltId - 1];
      const prevPassNm = badBolt.passCompleted === 0 ? 0 : TorqueEngine.PASS_TARGETS_NM[badBolt.passCompleted - 1];
      badBolt.currentTorqueNm = prevPassNm;
      this.warpedBoltId = null;
      this.lodPhase = "COMPREHENSION";
    }
    return this.getSnapshot();
  }

  /**
   * Selects a bolt by ID (1 to 6).
   * If matching expectedStarBolt, advances sequence normally.
   * If mismatch, applies premature torque and triggers gasket warp warning.
   */
  public selectBolt(boltId: number): FlangeSnapshot {
    return this.torqueSpecificBolt(boltId);
  }

  /**
   * Core deterministic state transition engine.
   */
  public torqueSpecificBolt(boltId: number): FlangeSnapshot {
    if (this.isSealed) return this.getSnapshot();
    if (boltId < 1 || boltId > 6) return this.getSnapshot();

    const expectedBoltId = TorqueEngine.STAR_ORDER[this.starCursor];
    const targetNm = TorqueEngine.PASS_TARGETS_NM[this.passIndex - 1];
    const bolt = this.bolts[boltId - 1];

    if (boltId !== expectedBoltId) {
      // Sequence violation: apply premature torque and trigger gasket warp alert
      bolt.currentTorqueNm = targetNm;
      this.warpedBoltId = boltId;
      this.lodPhase = "WARP_ALERT";
      return this.getSnapshot();
    }

    // Valid star-sequence bolt torqued
    bolt.currentTorqueNm = targetNm;
    bolt.passCompleted = this.passIndex;
    this.warpedBoltId = null;
    this.lodPhase = "PSYCHOMOTOR";

    // Advance star cursor
    this.starCursor++;
    if (this.starCursor >= TorqueEngine.STAR_ORDER.length) {
      if (this.passIndex < 3) {
        this.passIndex++;
        this.starCursor = 0;
        this.lodPhase = "COMPREHENSION";
      } else {
        this.isSealed = true;
        this.starCursor = 5; // maintain last active bolt for summary
        this.lodPhase = "COMPREHENSION";
      }
    } else {
      this.lodPhase = "COMPREHENSION";
    }

    return this.getSnapshot();
  }

  /**
   * Generates an immutable snapshot of the current flange state.
   */
  public getSnapshot(): FlangeSnapshot {
    const activeBoltId = TorqueEngine.STAR_ORDER[this.starCursor];
    const targetNm = TorqueEngine.PASS_TARGETS_NM[this.passIndex - 1];
    const passLabel = TorqueEngine.PASS_LABELS[this.passIndex - 1];
    const stepNum = this.starCursor + 1;

    const maxWarp = this.warpedBoltId !== null
      ? Number((targetNm * TorqueEngine.GASKET_WARP_COEFF).toFixed(1))
      : 0.0;

    let specTagText = "";
    if (this.isSealed) {
      specTagText = "FLANGE SEALED · 100 Nm · 0.0 mm WARP";
    } else if (this.focusMode) {
      specTagText = `P${this.passIndex} · B${activeBoltId} · ${targetNm} Nm`;
    } else {
      specTagText = `BOLT ${stepNum} OF 6 · PASS ${this.passIndex}\nTARGET: ${targetNm} Nm ${passLabel}`;
    }

    const warpBannerText = this.warpedBoltId !== null
      ? `!! SEQUENCE ERROR: UNDO BOLT ${this.warpedBoltId} (-${targetNm} Nm) !!`
      : "";

    return {
      passIndex: this.passIndex,
      stepInPass: stepNum,
      activeBoltId,
      targetTorqueNm: targetNm,
      focusModeEnabled: this.focusMode,
      lodPhase: this.lodPhase,
      maxGasketWarpMm: maxWarp,
      warpedBoltId: this.warpedBoltId,
      isFlangeSealed: this.isSealed,
      specTagText,
      warpBannerText,
      bolts: this.bolts.map((b) => ({
        ...b,
        positionCm: { ...b.positionCm }
      }))
    };
  }
}
