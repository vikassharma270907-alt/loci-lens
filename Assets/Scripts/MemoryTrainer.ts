/**
 * TorqueLock AR — MemoryTrainer.ts
 * Manages Method of Loci spatial memory associations and active recall on the 6-bolt flange.
 *
 * Grounded in:
 * - Krokos et al. (2019): Spatial immersion aids memory retrieval.
 * - Moll & Sykes (2023): Fast-learning Method of Loci in spatial environments.
 * - Peeters & Segundo-Ortin (2019): Embodied enactive spatial learning.
 */

export type TrainingExperienceMode = "LEARN" | "RECALL" | "PRACTISE" | "SUMMARY" | "REVIEW";

export interface BoltLearningCue {
  readonly boltId: number;
  readonly sequenceStep: number; // 1 to 6
  readonly oClock: string;
  readonly title: string;
  readonly mnemonic: string;
  readonly spatialInstruction: string;
  readonly positionCm: { readonly x: number; readonly y: number; readonly z: number };
}

export interface RecallResult {
  readonly isCorrect: boolean;
  readonly selectedBoltId: number;
  readonly expectedBoltId: number;
  readonly feedbackMessage: string;
  readonly currentStep: number;
  readonly isComplete: boolean;
}

export interface TrainingSummary {
  readonly totalSteps: number;
  readonly correctRecallCount: number;
  readonly missedRecallCount: number;
  readonly recallAccuracyPct: number;
  readonly missedBoltIds: readonly number[];
  readonly practiceCompleted: boolean;
  readonly reviewRecommendations: readonly string[];
}

export class MemoryTrainer {
  public static readonly STAR_SEQUENCE: readonly number[] = [1, 4, 2, 5, 3, 6];

  public static readonly CUES: readonly BoltLearningCue[] = Object.freeze([
    {
      boltId: 1,
      sequenceStep: 1,
      oClock: "12 o'clock",
      title: "Bolt 1: Initial Anchor",
      mnemonic: "Top Origin — Anchor the reference plane",
      spatialInstruction: "Begin at the top 12 o'clock bolt. Tighten to initial snug target.",
      positionCm: { x: 0, y: -14, z: -130.0 }
    },
    {
      boltId: 4,
      sequenceStep: 2,
      oClock: "6 o'clock",
      title: "Bolt 4: Opposing Cross",
      mnemonic: "Direct Polar Opposite — Equalize centerline load",
      spatialInstruction: "Cross directly through the flange center to 6 o'clock to balance initial clamp.",
      positionCm: { x: 0, y: -14, z: -100.0 }
    },
    {
      boltId: 2,
      sequenceStep: 3,
      oClock: "2 o'clock",
      title: "Bolt 2: Next Pair Shift",
      mnemonic: "Upper-Right Companion — Begin the secondary axis",
      spatialInstruction: "Rotate 60° clockwise to 2 o'clock to initiate the second compression pair.",
      positionCm: { x: 13, y: -14, z: -122.5 }
    },
    {
      boltId: 5,
      sequenceStep: 4,
      oClock: "8 o'clock",
      title: "Bolt 5: Second Polar Cross",
      mnemonic: "Lower-Left Opposite — Counterbalance the pair",
      spatialInstruction: "Cross again through center to 8 o'clock, locking down the secondary diagonal.",
      positionCm: { x: -13, y: -14, z: -107.5 }
    },
    {
      boltId: 3,
      sequenceStep: 5,
      oClock: "4 o'clock",
      title: "Bolt 3: Final Pair Entry",
      mnemonic: "Lower-Right Wing — Stabilize remaining quadrant",
      spatialInstruction: "Advance to 4 o'clock to anchor the final cross pair before perimeter lock.",
      positionCm: { x: 13, y: -14, z: -107.5 }
    },
    {
      boltId: 6,
      sequenceStep: 6,
      oClock: "10 o'clock",
      title: "Bolt 6: Pattern Closure",
      mnemonic: "Upper-Left Finish — Complete the star seal",
      spatialInstruction: "Cross back to 10 o'clock to finalize the 6-point star and achieve uniform gasket compression.",
      positionCm: { x: -13, y: -14, z: -122.5 }
    }
  ]);

  private mode: TrainingExperienceMode = "LEARN";
  private learnStepIndex: number = 0; // 0..5
  private recallStepIndex: number = 0; // 0..5
  private correctRecallCount: number = 0;
  private missedRecallCount: number = 0;
  private missedBoltIds: Set<number> = new Set();
  private recallHistory: Array<{ step: number; selected: number; expected: number; correct: boolean }> = [];
  private practiceCompleted: boolean = false;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.mode = "LEARN";
    this.learnStepIndex = 0;
    this.recallStepIndex = 0;
    this.correctRecallCount = 0;
    this.missedRecallCount = 0;
    this.missedBoltIds.clear();
    this.recallHistory = [];
    this.practiceCompleted = false;
  }

  public setMode(mode: TrainingExperienceMode): void {
    this.mode = mode;
    if (mode === "LEARN") {
      this.learnStepIndex = 0;
    } else if (mode === "RECALL") {
      this.recallStepIndex = 0;
    }
  }

  public getMode(): TrainingExperienceMode {
    return this.mode;
  }

  public getActiveLearnCue(): BoltLearningCue {
    return MemoryTrainer.CUES[this.learnStepIndex];
  }

  public advanceLearnStep(): BoltLearningCue {
    if (this.learnStepIndex < MemoryTrainer.CUES.length - 1) {
      this.learnStepIndex++;
    } else {
      // Completed learn mode, auto-advance to recall
      this.mode = "RECALL";
      this.recallStepIndex = 0;
    }
    return this.getActiveLearnCue();
  }

  public getExpectedRecallBoltId(): number {
    return MemoryTrainer.STAR_SEQUENCE[this.recallStepIndex];
  }

  public submitRecallAnswer(boltId: number): RecallResult {
    const expected = this.getExpectedRecallBoltId();
    const isCorrect = (boltId === expected);

    if (isCorrect) {
      this.correctRecallCount++;
      this.recallHistory.push({
        step: this.recallStepIndex + 1,
        selected: boltId,
        expected,
        correct: true
      });

      this.recallStepIndex++;
      const isComplete = this.recallStepIndex >= MemoryTrainer.STAR_SEQUENCE.length;
      if (isComplete) {
        this.mode = "PRACTISE";
      }

      return {
        isCorrect: true,
        selectedBoltId: boltId,
        expectedBoltId: expected,
        feedbackMessage: `Correct! Bolt ${boltId} is step ${this.recallStepIndex} in the star sequence.`,
        currentStep: this.recallStepIndex,
        isComplete
      };
    } else {
      this.missedRecallCount++;
      this.missedBoltIds.add(expected);
      this.recallHistory.push({
        step: this.recallStepIndex + 1,
        selected: boltId,
        expected,
        correct: false
      });

      const expectedCue = MemoryTrainer.CUES.find(c => c.boltId === expected);
      const cueDesc = expectedCue ? ` (${expectedCue.mnemonic})` : "";

      return {
        isCorrect: false,
        selectedBoltId: boltId,
        expectedBoltId: expected,
        feedbackMessage: `Incorrect. Expected Bolt ${expected}${cueDesc}, but selected Bolt ${boltId}. Try again.`,
        currentStep: this.recallStepIndex + 1,
        isComplete: false
      };
    }
  }

  public markPracticeCompleted(): void {
    this.practiceCompleted = true;
    this.mode = "SUMMARY";
  }

  public getSummary(): TrainingSummary {
    const totalSteps = MemoryTrainer.STAR_SEQUENCE.length;
    const totalAttempts = this.correctRecallCount + this.missedRecallCount;
    const accuracy = totalAttempts > 0
      ? Math.round((this.correctRecallCount / totalAttempts) * 100)
      : 0;

    const recommendations: string[] = [];
    if (this.missedBoltIds.size === 0) {
      recommendations.push("Perfect spatial recall! All 6 cross-pattern positions memorized flawlessly.");
      recommendations.push("Ready for multi-pass torque practice (35 Nm → 70 Nm → 100 Nm).");
    } else {
      this.missedBoltIds.forEach(id => {
        const cue = MemoryTrainer.CUES.find(c => c.boltId === id);
        if (cue) {
          recommendations.push(`Review Bolt ${id} (${cue.oClock}): "${cue.mnemonic}"`);
        }
      });
    }

    return {
      totalSteps,
      correctRecallCount: this.correctRecallCount,
      missedRecallCount: this.missedRecallCount,
      recallAccuracyPct: accuracy,
      missedBoltIds: Array.from(this.missedBoltIds),
      practiceCompleted: this.practiceCompleted,
      reviewRecommendations: recommendations
    };
  }

  public getCueForBolt(boltId: number): BoltLearningCue | undefined {
    return MemoryTrainer.CUES.find(c => c.boltId === boltId);
  }
}
