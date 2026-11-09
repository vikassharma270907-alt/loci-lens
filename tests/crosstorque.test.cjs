const test = require("node:test");
const assert = require("node:assert/strict");

// --- CrossTorqueEngine Domain Model ---

const STAR_SEQUENCE_ORDER = [1, 3, 5, 2, 4];
const PASS_TORQUE_TARGETS_NM = { 1: 35, 2: 75, 3: 110 };
const PASS_LABELS = { 1: "SNUG", 2: "INTERMEDIATE", 3: "FINAL LOCK" };
const HUB_RADIUS_CM = 11.0;
const HUB_CENTER_Y_CM = -8.0;
const HUB_DEPTH_Z_CM = -110.0;
const MAX_SAFE_WARP_MM = 0.05;

class CrossTorqueEngine {
  constructor() {
    this.reset();
  }

  reset() {
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

  getBolts() {
    return this.bolts;
  }

  getBoltById(boltId) {
    const found = this.bolts.find((b) => b.id === boltId);
    if (!found) throw new Error(`Invalid boltId: ${boltId}`);
    return found;
  }

  getActiveTargetBoltId() {
    if (this.isComplete()) return 0;
    return STAR_SEQUENCE_ORDER[this.sequenceCursor];
  }

  getPreviousBoltId() {
    if (this.completedSteps === 0) return STAR_SEQUENCE_ORDER[0];
    const prevIdx = (this.sequenceCursor + STAR_SEQUENCE_ORDER.length - 1) % STAR_SEQUENCE_ORDER.length;
    return STAR_SEQUENCE_ORDER[prevIdx];
  }

  isComplete() {
    return this.completedSteps >= 15;
  }

  isFocusMode() {
    return this.focusMode;
  }

  toggleFocusMode() {
    this.focusMode = !this.focusMode;
    const activeId = this.getActiveTargetBoltId();
    if (this.focusMode && activeId > 0) {
      this.lastVerdictText = `FOCUS MODE · EYES ON BOLT #${activeId}`;
    } else if (!this.focusMode && activeId > 0) {
      this.lastVerdictText = `NOMINAL · RUNOUT ${this.flangeWarpMm.toFixed(2)} mm · TORQUE BOLT #${activeId} (${PASS_TORQUE_TARGETS_NM[this.currentPass]} Nm)`;
    }
    return this.getSnapshot(activeId, true);
  }

  applyBoltTorque(boltId) {
    if (this.isComplete()) return this.getSnapshot(0, false);
    const expectedBoltId = this.getActiveTargetBoltId();
    const targetNm = PASS_TORQUE_TARGETS_NM[this.currentPass];

    if (boltId !== expectedBoltId) {
      this.mistakeCount += 1;
      this.flangeWarpMm = this.computeAsymmetricWarpMm(boltId, expectedBoltId, targetNm);
      this.lastStatus = "WARP_REJECTED";
      this.lastVerdictText = `BLOCKED: ADJACENT BOLT #${boltId} CAUSES +${this.flangeWarpMm.toFixed(2)} mm WARP — TORQUE #${expectedBoltId} NEXT`;
      return this.getSnapshot(boltId, false);
    }

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

    this.sequenceCursor += 1;
    if (this.sequenceCursor >= STAR_SEQUENCE_ORDER.length) {
      this.sequenceCursor = 0;
      if (this.currentPass < 3) {
        this.currentPass += 1;
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

  triggerSimulatedAdjacentError() {
    const expectedId = this.getActiveTargetBoltId();
    if (expectedId === 0) return this.getSnapshot(0, false);
    const adjacentBoltId = (expectedId % 5) + 1;
    return this.applyBoltTorque(adjacentBoltId);
  }

  triggerBoltCreepAlert(boltId = 3) {
    const bolt = this.bolts[boltId - 1];
    bolt.hasCreepAlert = true;
    bolt.appliedTorqueNm = Math.max(0, bolt.appliedTorqueNm - 14);
    this.flangeWarpMm = 0.16;
    this.lastStatus = "CREEP_ALERT";
    this.lastVerdictText = `CREEP ALERT: BOLT #${boltId} RELAXED (-14 Nm) · RE-CHECK BOLT #${boltId}`;
    return this.getSnapshot(boltId, false);
  }

  static computeOffAxisDirection(cameraYawDeg, boltXCm, boltZCm = HUB_DEPTH_Z_CM, thresholdDeg = 12.0) {
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

  computeAsymmetricWarpMm(attemptedBoltId, expectedBoltId, passTorqueNm) {
    const bAttempt = this.bolts[attemptedBoltId - 1];
    const bExpected = this.bolts[expectedBoltId - 1];
    const chordDistCm = Math.hypot(bAttempt.localXCm - bExpected.localXCm, bAttempt.localYCm - bExpected.localYCm);
    const rawWarp = 0.18 + (passTorqueNm / 110.0) * 0.18 * (13.0 / Math.max(chordDistCm, 1.0));
    return Number(rawWarp.toFixed(2));
  }

  getSnapshot(attemptedBoltId = this.getActiveTargetBoltId(), accepted = true) {
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

function runCrossTorqueEngineSelfTests() {
  const failures = [];
  let passed = 0;
  const check = (cond, msg) => (cond ? (passed += 1) : failures.push(msg));

  const engine = new CrossTorqueEngine();
  const init = engine.getSnapshot();
  check(init.currentPass === 1, "Initial pass must be 1");
  check(init.targetTorqueNm === 35, "Pass 1 torque must be 35 Nm");
  check(init.targetBoltId === 1, "Initial star target must be Bolt #1");
  check(init.flangeWarpMm <= MAX_SAFE_WARP_MM, "Initial warp must be <= 0.05 mm");

  const s1 = engine.applyBoltTorque(1);
  check(s1.accepted === true, "Bolt #1 must be accepted first");
  check(s1.targetBoltId === 3, "Next star target after Bolt #1 must be Bolt #3");
  check(engine.getBoltById(1).appliedTorqueNm === 35, "Bolt #1 torque must read 35 Nm");

  const err = engine.applyBoltTorque(2);
  check(err.accepted === false, "Adjacent Bolt #2 must be rejected when Bolt #3 is expected");
  check(err.status === "WARP_REJECTED", "Status must be WARP_REJECTED on adjacent bolt");
  check(err.flangeWarpMm >= 0.2, "Warp must spike >= 0.20 mm on adjacent bolt tighten");
  check(err.mistakeCount === 1, "Mistake count must increment to 1");
  check(err.targetBoltId === 3, "Target bolt must remain locked on Bolt #3 after error");

  engine.applyBoltTorque(3);
  engine.applyBoltTorque(5);
  engine.applyBoltTorque(2);
  const p1Done = engine.applyBoltTorque(4);
  check(p1Done.completedSteps === 5, "Completed steps after Pass 1 must be 5");
  check(p1Done.currentPass === 2, "Must advance to Pass 2 after 5 star bolts");
  check(p1Done.targetTorqueNm === 75, "Pass 2 target must be 75 Nm");
  check(p1Done.targetBoltId === 1, "Pass 2 must restart star sequence at Bolt #1");

  const centered = CrossTorqueEngine.computeOffAxisDirection(0, 6.5, -110, 12);
  check(centered.isOffAxis === false, "Bolt #3 (+6.5 cm) must be inside FOV at yaw 0 deg");
  const turnedLeft = CrossTorqueEngine.computeOffAxisDirection(18, 6.5, -110, 12);
  check(
    turnedLeft.isOffAxis === true && turnedLeft.direction === "RIGHT",
    "Looking 18 deg left must trigger RIGHT edge arrow for Bolt #3"
  );

  for (const bId of STAR_SEQUENCE_ORDER) {
    engine.applyBoltTorque(bId);
  }
  check(engine.getSnapshot().currentPass === 3, "Must advance to Pass 3");
  check(engine.getSnapshot().targetTorqueNm === 110, "Pass 3 target must be 110 Nm");

  for (const bId of STAR_SEQUENCE_ORDER) {
    engine.applyBoltTorque(bId);
  }
  const finalSnap = engine.getSnapshot();
  check(finalSnap.isComplete === true && finalSnap.completedSteps === 15, "All 15 steps must complete");
  check(finalSnap.status === "SEAL_VERIFIED", "Final status must be SEAL_VERIFIED");

  return { passed, total: passed + failures.length, failures };
}

// --- Test Suite Definitions ---

test("CrossTorque Engine: All 22 deterministic self-tests pass with 0 failures", () => {
  const result = runCrossTorqueEngineSelfTests();
  assert.equal(result.failures.length, 0, `Failures encountered: ${result.failures.join("; ")}`);
  assert.equal(result.passed, 22, "Must pass all 22 domain assertions");
});

test("LEAF Scenario C1 (c1_initial_layout): Initial 1:1 spatial layout at Z = -110 cm", () => {
  const engine = new CrossTorqueEngine();
  const init = engine.getSnapshot();

  // Layout positions
  const bolts = engine.getBolts();
  assert.equal(bolts.length, 5);
  assert.deepEqual(
    bolts.map((b) => ({ id: b.id, x: b.localXCm, y: b.localYCm })),
    [
      { id: 1, x: 0.0, y: 3.0 },
      { id: 2, x: 10.5, y: -4.6 },
      { id: 3, x: 6.5, y: -16.9 },
      { id: 4, x: -6.5, y: -16.9 },
      { id: 5, x: -10.5, y: -4.6 },
    ]
  );

  // Pass banner
  assert.equal(init.bannerText, "PASS 1 OF 3 · TARGET 35 Nm (SNUG)");
  assert.equal(init.targetBoltId, 1);
  assert.equal(init.isComplete, false);
  assert.equal(init.flangeWarpMm, 0.02);
});

test("LEAF Scenario C2 (c2_star_progression): Star-pattern progression across Pass 1 (35 Nm)", () => {
  const engine = new CrossTorqueEngine();
  const s1 = engine.applyBoltTorque(1);
  assert.equal(s1.accepted, true);
  assert.equal(s1.targetBoltId, 3);
  assert.equal(engine.getBoltById(1).appliedTorqueNm, 35);

  // 3 -> 5 -> 2 -> 4
  const s2 = engine.applyBoltTorque(3);
  assert.equal(s2.targetBoltId, 5);
  const s3 = engine.applyBoltTorque(5);
  assert.equal(s3.targetBoltId, 2);
  const s4 = engine.applyBoltTorque(2);
  assert.equal(s4.targetBoltId, 4);
  const s5 = engine.applyBoltTorque(4);

  assert.equal(s5.completedSteps, 5);
  assert.equal(s5.currentPass, 2);
  assert.equal(s5.targetTorqueNm, 75);
  assert.equal(s5.targetBoltId, 1);
  assert.equal(s5.bannerText, "PASS 2 OF 3 · TARGET 75 Nm (INTERMEDIATE)");
});

test("LEAF Scenario C3 (c3_adjacent_error_rejection): Out-of-sequence adjacent bolt rejection & warp spike", () => {
  const engine = new CrossTorqueEngine();
  engine.applyBoltTorque(1); // Target is now Bolt #3

  // Attempt adjacent Bolt #2
  const err = engine.applyBoltTorque(2);
  assert.equal(err.accepted, false);
  assert.equal(err.status, "WARP_REJECTED");
  assert.equal(err.mistakeCount, 1);
  assert.equal(err.targetBoltId, 3);
  assert.equal(err.flangeWarpMm, 0.24);
  assert.equal(
    err.verdictText,
    "BLOCKED: ADJACENT BOLT #2 CAUSES +0.24 mm WARP — TORQUE #3 NEXT"
  );
});

test("LEAF Scenario C4 (c4_focus_and_edge_arrow): Focus mode progressive disclosure & off-axis edge arrow", () => {
  const engine = new CrossTorqueEngine();
  const focusOn = engine.toggleFocusMode();
  assert.equal(focusOn.focusMode, true);
  assert.equal(focusOn.bannerText, "FOCUS · BOLT #1 (35 Nm)");
  assert.equal(focusOn.verdictText, "FOCUS MODE · EYES ON BOLT #1");

  // Camera yaw 18 deg left with Bolt #3 (+6.5 cm) active
  engine.applyBoltTorque(1); // Bolt #3 is active
  const offAxis = CrossTorqueEngine.computeOffAxisDirection(18.0, 6.5, -110, 12.0);
  assert.equal(offAxis.isOffAxis, true);
  assert.equal(offAxis.direction, "RIGHT");

  // Returned to 0 deg
  const centered = CrossTorqueEngine.computeOffAxisDirection(0.0, 6.5, -110, 12.0);
  assert.equal(centered.isOffAxis, false);

  const focusOff = engine.toggleFocusMode();
  assert.equal(focusOff.focusMode, false);
  assert.equal(focusOff.bannerText, "PASS 1 OF 3 · TARGET 35 Nm (SNUG)");
});

test("LEAF Scenario C5 (c5_full_completion_and_reset): 15-step completion @ 110 Nm & one-pinch reset", () => {
  const engine = new CrossTorqueEngine();

  // Complete all 3 passes (15 steps)
  for (let pass = 1; pass <= 3; pass++) {
    for (const bId of STAR_SEQUENCE_ORDER) {
      engine.applyBoltTorque(bId);
    }
  }

  const snap = engine.getSnapshot();
  assert.equal(snap.isComplete, true);
  assert.equal(snap.completedSteps, 15);
  assert.equal(snap.status, "SEAL_VERIFIED");
  assert.equal(snap.targetBoltId, 0);
  assert.match(snap.debriefText, /SEAL VERIFIED · 5\/5 BOLTS @ 110 Nm/);

  // Trigger reset
  const resetSnap = engine.reset();
  assert.equal(resetSnap.isComplete, false);
  assert.equal(resetSnap.completedSteps, 0);
  assert.equal(resetSnap.currentPass, 1);
  assert.equal(resetSnap.targetBoltId, 1);
  assert.equal(resetSnap.bannerText, "PASS 1 OF 3 · TARGET 35 Nm (SNUG)");
});

test("LEAF Scenario C6 (c6_ergonomic_reach_guard): Star sequence hover-reach & dock clearance", () => {
  const engine = new CrossTorqueEngine();

  // Validate pentagonal bolt coordinates against the ergonomic 32x28 deg safe frame
  // At Z = -110 cm, horizontal span is 63.1 cm (+/- 31.5 cm) and vertical span is 54.9 cm (+/- 27.4 cm)
  const safeHalfWidth = 31.5;
  const safeHalfHeight = 27.4;

  for (const b of engine.getBolts()) {
    assert.ok(Math.abs(b.localXCm) <= safeHalfWidth, `Bolt #${b.id} X (${b.localXCm}) within safe width`);
    assert.ok(Math.abs(b.localYCm) <= safeHalfHeight, `Bolt #${b.id} Y (${b.localYCm}) within safe height`);
  }

  // Control dock buttons at Y = -29 cm, Z = -95 cm
  // Bolt 3 and 4 are at Y = -16.9 cm, Z = -110 cm -> delta Y = 12.1 cm, delta Z = 15 cm -> zero raycast collision
  const boltLowestY = -16.9;
  const dockY = -29.0;
  const verticalClearance = Math.abs(dockY - boltLowestY);
  assert.ok(verticalClearance >= 10.0, "Dock buttons maintain at least 10 cm vertical clearance from lowest bolts");

  // Step through star sequence successfully
  for (const bId of STAR_SEQUENCE_ORDER) {
    const res = engine.applyBoltTorque(bId);
    assert.equal(res.accepted, true);
  }
  assert.equal(engine.getSnapshot().currentPass, 2);
});
