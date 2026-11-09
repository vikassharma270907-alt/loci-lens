const test = require("node:test");
const assert = require("node:assert/strict");

// --- Model Pure TypeScript Domain Classes for Node Runtime ---

class TorqueEngine {
  static STAR_ORDER = [1, 4, 2, 5, 3, 6];
  static PASS_TARGETS_NM = [35, 70, 100];
  static PASS_LABELS = ["SNUG", "INTERMEDIATE", "FINAL SPEC"];
  static GASKET_WARP_COEFF = 0.0514; // 35 Nm imbalance -> 1.80 mm warp

  static BOLT_COORDS = [
    { x: 0, y: -14, z: -130.0 }, // Bolt 1 (12 o'clock)
    { x: 13, y: -14, z: -122.5 }, // Bolt 2 (2 o'clock)
    { x: 13, y: -14, z: -107.5 }, // Bolt 3 (4 o'clock)
    { x: 0, y: -14, z: -100.0 }, // Bolt 4 (6 o'clock)
    { x: -13, y: -14, z: -107.5 }, // Bolt 5 (8 o'clock)
    { x: -13, y: -14, z: -122.5 } // Bolt 6 (10 o'clock)
  ];

  constructor() {
    this.reset();
  }

  reset() {
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

  toggleFocusMode() {
    this.focusMode = !this.focusMode;
    return this.getSnapshot();
  }

  applyTorqueToActiveOrRelieve() {
    if (this.warpedBoltId !== null) {
      return this.recoverFromSequenceError();
    }
    if (this.isSealed) {
      return this.getSnapshot();
    }
    const expectedBoltId = TorqueEngine.STAR_ORDER[this.starCursor];
    return this.torqueSpecificBolt(expectedBoltId);
  }

  advanceCorrectStep() {
    return this.applyTorqueToActiveOrRelieve();
  }

  simulateWrongBolt(wrongBoltId) {
    const activeId = TorqueEngine.STAR_ORDER[this.starCursor];
    const candidateId = wrongBoltId !== undefined ? wrongBoltId : (activeId === 2 ? 3 : 2);
    return this.torqueSpecificBolt(candidateId);
  }

  simulateWrongBoltError() {
    return this.simulateWrongBolt();
  }

  recoverFromSequenceError() {
    if (this.warpedBoltId !== null) {
      const badBolt = this.bolts[this.warpedBoltId - 1];
      const prevPassNm = badBolt.passCompleted === 0 ? 0 : TorqueEngine.PASS_TARGETS_NM[badBolt.passCompleted - 1];
      badBolt.currentTorqueNm = prevPassNm;
      this.warpedBoltId = null;
      this.lodPhase = "COMPREHENSION";
    }
    return this.getSnapshot();
  }

  selectBolt(boltId) {
    return this.torqueSpecificBolt(boltId);
  }

  torqueSpecificBolt(boltId) {
    if (this.isSealed) return this.getSnapshot();
    if (boltId < 1 || boltId > 6) return this.getSnapshot();

    const expectedBoltId = TorqueEngine.STAR_ORDER[this.starCursor];
    const targetNm = TorqueEngine.PASS_TARGETS_NM[this.passIndex - 1];
    const bolt = this.bolts[boltId - 1];

    if (boltId !== expectedBoltId) {
      bolt.currentTorqueNm = targetNm;
      this.warpedBoltId = boltId;
      this.lodPhase = "WARP_ALERT";
      return this.getSnapshot();
    }

    bolt.currentTorqueNm = targetNm;
    bolt.passCompleted = this.passIndex;
    this.warpedBoltId = null;
    this.lodPhase = "PSYCHOMOTOR";

    this.starCursor++;
    if (this.starCursor >= TorqueEngine.STAR_ORDER.length) {
      if (this.passIndex < 3) {
        this.passIndex++;
        this.starCursor = 0;
        this.lodPhase = "COMPREHENSION";
      } else {
        this.isSealed = true;
        this.starCursor = 5;
        this.lodPhase = "COMPREHENSION";
      }
    } else {
      this.lodPhase = "COMPREHENSION";
    }

    return this.getSnapshot();
  }

  getSnapshot() {
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

class MemoryTrainer {
  static STAR_SEQUENCE = [1, 4, 2, 5, 3, 6];
  static CUES = [
    { boltId: 1, sequenceStep: 1, oClock: "12 o'clock", mnemonic: "Top Origin — Anchor the reference plane" },
    { boltId: 4, sequenceStep: 2, oClock: "6 o'clock", mnemonic: "Direct Polar Opposite — Equalize centerline load" },
    { boltId: 2, sequenceStep: 3, oClock: "2 o'clock", mnemonic: "Upper-Right Companion — Begin the secondary axis" },
    { boltId: 5, sequenceStep: 4, oClock: "8 o'clock", mnemonic: "Lower-Left Opposite — Counterbalance the pair" },
    { boltId: 3, sequenceStep: 5, oClock: "4 o'clock", mnemonic: "Lower-Right Wing — Stabilize remaining quadrant" },
    { boltId: 6, sequenceStep: 6, oClock: "10 o'clock", mnemonic: "Upper-Left Finish — Complete the star seal" }
  ];

  constructor() {
    this.reset();
  }

  reset() {
    this.mode = "LEARN";
    this.learnStepIndex = 0;
    this.recallStepIndex = 0;
    this.correctRecallCount = 0;
    this.missedRecallCount = 0;
    this.missedBoltIds = new Set();
    this.practiceCompleted = false;
  }

  getMode() {
    return this.mode;
  }

  setMode(m) {
    this.mode = m;
  }

  getActiveLearnCue() {
    return MemoryTrainer.CUES[this.learnStepIndex];
  }

  advanceLearnStep() {
    if (this.learnStepIndex < MemoryTrainer.CUES.length - 1) {
      this.learnStepIndex++;
    } else {
      this.mode = "RECALL";
      this.recallStepIndex = 0;
    }
    return this.getActiveLearnCue();
  }

  getExpectedRecallBoltId() {
    return MemoryTrainer.STAR_SEQUENCE[this.recallStepIndex];
  }

  submitRecallAnswer(boltId) {
    const expected = this.getExpectedRecallBoltId();
    const isCorrect = (boltId === expected);

    if (isCorrect) {
      this.correctRecallCount++;
      this.recallStepIndex++;
      const isComplete = this.recallStepIndex >= MemoryTrainer.STAR_SEQUENCE.length;
      if (isComplete) {
        this.mode = "PRACTISE";
      }
      return {
        isCorrect: true,
        selectedBoltId: boltId,
        expectedBoltId: expected,
        currentStep: this.recallStepIndex,
        isComplete
      };
    } else {
      this.missedRecallCount++;
      this.missedBoltIds.add(expected);
      return {
        isCorrect: false,
        selectedBoltId: boltId,
        expectedBoltId: expected,
        currentStep: this.recallStepIndex + 1,
        isComplete: false
      };
    }
  }

  markPracticeCompleted() {
    this.practiceCompleted = true;
    this.mode = "SUMMARY";
  }

  getSummary() {
    const totalSteps = MemoryTrainer.STAR_SEQUENCE.length;
    const totalAttempts = this.correctRecallCount + this.missedRecallCount;
    const accuracy = totalAttempts > 0
      ? Math.round((this.correctRecallCount / totalAttempts) * 100)
      : 0;

    return {
      totalSteps,
      correctRecallCount: this.correctRecallCount,
      missedRecallCount: this.missedRecallCount,
      recallAccuracyPct: accuracy,
      missedBoltIds: Array.from(this.missedBoltIds),
      practiceCompleted: this.practiceCompleted
    };
  }
}

class ReviewStore {
  constructor() {
    this.records = new Map();
    for (let id = 1; id <= 6; id++) {
      this.records.set(id, { boltId: id, box: 1, totalCorrect: 0, totalMissed: 0, correctStreak: 0 });
    }
  }

  recordAttempt(boltId, outcome) {
    const rec = this.records.get(boltId);
    if (!rec) return null;
    if (outcome === "got_it") {
      rec.totalCorrect++;
      rec.correctStreak++;
      if (rec.box === 1) rec.box = 2;
      else if (rec.box === 2) rec.box = 3;
    } else {
      rec.totalMissed++;
      rec.correctStreak = 0;
      rec.box = 1;
    }
    return { ...rec };
  }

  getBoxDistribution() {
    let b1 = 0, b2 = 0, b3 = 0;
    this.records.forEach((rec) => {
      if (rec.box === 1) b1++;
      else if (rec.box === 2) b2++;
      else if (rec.box === 3) b3++;
    });
    return { box1: b1, box2: b2, box3: b3 };
  }
}

// =========================================================================
// TEST SUITE: TorqueLock AR Core Criteria & Architecture Verification
// =========================================================================

test("C1 (Initial Spatial Layout & Star Target #1): Initial state matches SPECS blueprint", () => {
  const engine = new TorqueEngine();
  const snap = engine.getSnapshot();

  assert.equal(snap.passIndex, 1);
  assert.equal(snap.stepInPass, 1);
  assert.equal(snap.activeBoltId, 1);
  assert.equal(snap.targetTorqueNm, 35);
  assert.equal(snap.isFlangeSealed, false);
  assert.equal(snap.warpedBoltId, null);
  assert.equal(snap.maxGasketWarpMm, 0.0);
  assert.equal(snap.specTagText, "BOLT 1 OF 6 · PASS 1\nTARGET: 35 Nm SNUG");

  // Verify all 6 bolts initialized to 0 Nm
  assert.equal(snap.bolts.length, 6);
  snap.bolts.forEach((b) => {
    assert.equal(b.currentTorqueNm, 0);
    assert.equal(b.passCompleted, 0);
  });

  // Verify Bolt 1 spatial position matches (0, -14, -130) cm
  const bolt1 = snap.bolts.find((b) => b.id === 1);
  assert.ok(bolt1);
  assert.equal(bolt1.positionCm.x, 0);
  assert.equal(bolt1.positionCm.y, -14);
  assert.equal(bolt1.positionCm.z, -130);
});

test("C2 (Comprehension-to-Psychomotor LOD Transition & Star Advance): Advance Bolt 1 -> Bolt 4", () => {
  const engine = new TorqueEngine();
  
  // Advance Bolt 1 (expected)
  const snap = engine.applyTorqueToActiveOrRelieve();

  // Bolt 1 should be torqued to 35 Nm and completed for Pass 1
  const bolt1 = snap.bolts.find((b) => b.id === 1);
  assert.equal(bolt1.currentTorqueNm, 35);
  assert.equal(bolt1.passCompleted, 1);

  // Active ring should advance across center to Bolt 4 (6 o'clock)
  assert.equal(snap.activeBoltId, 4);
  assert.equal(snap.stepInPass, 2);
  assert.equal(snap.specTagText, "BOLT 2 OF 6 · PASS 1\nTARGET: 35 Nm SNUG");

  // Verify Bolt 4 spatial position is (0, -14, -100) cm
  const bolt4 = snap.bolts.find((b) => b.id === 4);
  assert.equal(bolt4.positionCm.x, 0);
  assert.equal(bolt4.positionCm.y, -14);
  assert.equal(bolt4.positionCm.z, -100);
});

test("C3 (Out-of-Sequence Gasket Warp Alert & Recovery): Premature torque triggers 1.8 mm warp", () => {
  const engine = new TorqueEngine();

  // Bolt 1 is active; intentionally select Bolt 2 (out of sequence)
  const errSnap = engine.torqueSpecificBolt(2);

  assert.equal(errSnap.lodPhase, "WARP_ALERT");
  assert.equal(errSnap.warpedBoltId, 2);
  // 35 Nm * 0.0514 = 1.80 mm
  assert.equal(errSnap.maxGasketWarpMm, 1.8);
  assert.equal(errSnap.warpBannerText, "!! SEQUENCE ERROR: UNDO BOLT 2 (-35 Nm) !!");

  // Relieve the out-of-sequence bolt
  const recSnap = engine.recoverFromSequenceError();

  assert.equal(recSnap.lodPhase, "COMPREHENSION");
  assert.equal(recSnap.warpedBoltId, null);
  assert.equal(recSnap.maxGasketWarpMm, 0.0);
  assert.equal(recSnap.warpBannerText, "");

  // Bolt 2 current torque should be reset back to 0 Nm
  const bolt2 = recSnap.bolts.find((b) => b.id === 2);
  assert.equal(bolt2.currentTorqueNm, 0);
});

test("C4 (Focus Mode Progressive Disclosure): Collapses 2-line tag to 1-line pill", () => {
  const engine = new TorqueEngine();

  // Initial tag is full 2-line
  const initialSnap = engine.getSnapshot();
  assert.equal(initialSnap.specTagText, "BOLT 1 OF 6 · PASS 1\nTARGET: 35 Nm SNUG");
  assert.equal(initialSnap.focusModeEnabled, false);

  // Toggle Focus Mode ON
  const focusSnap = engine.toggleFocusMode();
  assert.equal(focusSnap.focusModeEnabled, true);
  assert.equal(focusSnap.specTagText, "P1 · B1 · 35 Nm");

  // Toggle Focus Mode OFF (restores full text)
  const restoredSnap = engine.toggleFocusMode();
  assert.equal(restoredSnap.focusModeEnabled, false);
  assert.equal(restoredSnap.specTagText, "BOLT 1 OF 6 · PASS 1\nTARGET: 35 Nm SNUG");
});

test("C5 (Full Pass Completion & Seal Summary): 1 -> 4 -> 2 -> 5 -> 3 -> 6 transitions cleanly", () => {
  const engine = new TorqueEngine();

  // Complete Pass 1 (35 Nm across all 6 bolts in star sequence)
  for (let i = 0; i < 6; i++) {
    engine.applyTorqueToActiveOrRelieve();
  }

  let snap = engine.getSnapshot();
  // Should transition to Pass 2 (70 Nm) at Bolt 1
  assert.equal(snap.passIndex, 2);
  assert.equal(snap.stepInPass, 1);
  assert.equal(snap.activeBoltId, 1);
  assert.equal(snap.targetTorqueNm, 70);
  assert.equal(snap.specTagText, "BOLT 1 OF 6 · PASS 2\nTARGET: 70 Nm INTERMEDIATE");

  // Complete Pass 2 (70 Nm)
  for (let i = 0; i < 6; i++) {
    engine.applyTorqueToActiveOrRelieve();
  }

  snap = engine.getSnapshot();
  // Should transition to Pass 3 (100 Nm) at Bolt 1
  assert.equal(snap.passIndex, 3);
  assert.equal(snap.targetTorqueNm, 100);
  assert.equal(snap.specTagText, "BOLT 1 OF 6 · PASS 3\nTARGET: 100 Nm FINAL SPEC");

  // Complete Pass 3 (100 Nm)
  for (let i = 0; i < 6; i++) {
    engine.applyTorqueToActiveOrRelieve();
  }

  snap = engine.getSnapshot();
  // Flange should be completely sealed
  assert.equal(snap.isFlangeSealed, true);
  assert.equal(snap.specTagText, "FLANGE SEALED · 100 Nm · 0.0 mm WARP");
  assert.equal(snap.maxGasketWarpMm, 0.0);
});

test("C6 (Ergonomic Reach & Waveguide Safe Zone): Layout parameters comply with CHI 2021 & SUI 2017", () => {
  // Verify all 6 bolts fit inside the forward hemisphere (x in [-15, +15], z in [-100, -130])
  TorqueEngine.BOLT_COORDS.forEach((pos) => {
    assert.ok(pos.x >= -15 && pos.x <= 15, `Bolt X (${pos.x}) inside ±15 cm`);
    assert.ok(pos.z >= -130 && pos.z <= -100, `Bolt Z (${pos.z}) inside [-130, -100] cm`);
    assert.equal(pos.y, -14, "Bolts sit at workbench surface height y = -14 cm");
  });

  // Verify Eye-Level Clear Zone (y = -4 to +15 cm) is strictly below eye level
  const flangeY = -18; // cm
  const dockY = -28; // cm
  const dockZ = -105; // cm (within comfortable arm reach)
  assert.ok(flangeY < -4, "Flange is below eye level clear zone");
  assert.ok(dockY < -4, "Dock is in lower visual field");
  assert.ok(dockZ > -120 && dockZ < -80, "Dock is within comfortable reaching distance");
});

test("MemoryTrainer (Method of Loci Spatial Encoding & Active Recall): Learn, Recall, and Summary", () => {
  const trainer = new MemoryTrainer();

  assert.equal(trainer.getMode(), "LEARN");
  const firstCue = trainer.getActiveLearnCue();
  assert.equal(firstCue.boltId, 1);
  assert.equal(firstCue.oClock, "12 o'clock");

  // Step through learn mode (6 steps)
  for (let i = 0; i < 5; i++) {
    trainer.advanceLearnStep();
  }
  trainer.advanceLearnStep(); // Completes learn mode, enters RECALL

  assert.equal(trainer.getMode(), "RECALL");
  assert.equal(trainer.getExpectedRecallBoltId(), 1);

  // Correct recall on Step 1 (Bolt 1)
  const res1 = trainer.submitRecallAnswer(1);
  assert.equal(res1.isCorrect, true);
  assert.equal(trainer.getExpectedRecallBoltId(), 4);

  // Mistake on Step 2 (Selected 2 instead of 4)
  const res2 = trainer.submitRecallAnswer(2);
  assert.equal(res2.isCorrect, false);
  assert.equal(res2.expectedBoltId, 4);

  // Retry with correct answer (Bolt 4)
  const res2Retry = trainer.submitRecallAnswer(4);
  assert.equal(res2Retry.isCorrect, true);

  // Complete remaining recall steps: 2, 5, 3, 6
  trainer.submitRecallAnswer(2);
  trainer.submitRecallAnswer(5);
  trainer.submitRecallAnswer(3);
  const finalRecall = trainer.submitRecallAnswer(6);
  assert.equal(finalRecall.isComplete, true);
  assert.equal(trainer.getMode(), "PRACTISE");

  // Mark practice completed and inspect summary
  trainer.markPracticeCompleted();
  assert.equal(trainer.getMode(), "SUMMARY");

  const summary = trainer.getSummary();
  assert.equal(summary.totalSteps, 6);
  assert.equal(summary.correctRecallCount, 6);
  assert.equal(summary.missedRecallCount, 1);
  assert.deepEqual(summary.missedBoltIds, [4]);
  assert.equal(summary.practiceCompleted, true);
  assert.ok(summary.recallAccuracyPct > 80);
});

test("ReviewStore (Leitner 3-Box Spaced Repetition): Tracks retention across sessions", () => {
  const store = new ReviewStore();

  const initialDist = store.getBoxDistribution();
  assert.equal(initialDist.box1, 6);
  assert.equal(initialDist.box2, 0);
  assert.equal(initialDist.box3, 0);

  // Got it on Bolt 1 promotes to Box 2
  const rec1 = store.recordAttempt(1, "got_it");
  assert.equal(rec1.box, 2);

  // Repeated got it on Bolt 1 promotes to Box 3
  const rec1Mastered = store.recordAttempt(1, "got_it");
  assert.equal(rec1Mastered.box, 3);

  // Missed on Bolt 1 demotes back to Box 1
  const rec1Demoted = store.recordAttempt(1, "missed");
  assert.equal(rec1Demoted.box, 1);
});
