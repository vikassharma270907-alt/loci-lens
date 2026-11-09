/**
 * TorqueLock AR — ReviewStore.ts
 * Implements a 3-Box Leitner Spaced-Repetition System for Bolt Sequence Retention.
 *
 * Grounded in:
 * - Ebbinghaus & Leitner spaced retrieval principles.
 * - Persistent retention scoring across recall passes without requiring cloud databases.
 */

export interface BoltReviewRecord {
  readonly boltId: number;
  box: 1 | 2 | 3;
  correctStreak: number;
  totalCorrect: number;
  totalMissed: number;
  lastOutcome: "got_it" | "missed" | "untested";
  lastTestedAt?: number;
}

export interface ReviewStoreSummary {
  readonly totalBolts: number;
  readonly box1Count: number; // Needs Review
  readonly box2Count: number; // Learning
  readonly box3Count: number; // Mastered
  readonly masteryPercentage: number;
  readonly recommendations: readonly string[];
}

export class ReviewStore {
  private records: Map<number, BoltReviewRecord> = new Map();

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.records.clear();
    for (let boltId = 1; boltId <= 6; boltId++) {
      this.records.set(boltId, {
        boltId,
        box: 1,
        correctStreak: 0,
        totalCorrect: 0,
        totalMissed: 0,
        lastOutcome: "untested"
      });
    }
  }

  public recordAttempt(boltId: number, outcome: "got_it" | "missed"): BoltReviewRecord {
    const rec = this.records.get(boltId) || {
      boltId,
      box: 1,
      correctStreak: 0,
      totalCorrect: 0,
      totalMissed: 0,
      lastOutcome: "untested"
    };

    rec.lastOutcome = outcome;
    rec.lastTestedAt = Date.now();

    if (outcome === "got_it") {
      rec.totalCorrect++;
      rec.correctStreak++;
      if (rec.box === 1) {
        rec.box = 2;
      } else if (rec.box === 2) {
        rec.box = 3;
      }
    } else {
      rec.totalMissed++;
      rec.correctStreak = 0;
      rec.box = 1; // Demote back to active review
    }

    this.records.set(boltId, rec);
    return { ...rec };
  }

  public getBoltRecord(boltId: number): BoltReviewRecord | undefined {
    const rec = this.records.get(boltId);
    return rec ? { ...rec } : undefined;
  }

  public getMissedBolts(): number[] {
    const missed: number[] = [];
    this.records.forEach((rec, boltId) => {
      if (rec.box === 1 || rec.lastOutcome === "missed") {
        missed.push(boltId);
      }
    });
    return missed;
  }

  public getMasteredBolts(): number[] {
    const mastered: number[] = [];
    this.records.forEach((rec, boltId) => {
      if (rec.box === 3) {
        mastered.push(boltId);
      }
    });
    return mastered;
  }

  public getBoxDistribution(): { box1: number; box2: number; box3: number } {
    let b1 = 0;
    let b2 = 0;
    let b3 = 0;
    this.records.forEach((rec) => {
      if (rec.box === 1) b1++;
      else if (rec.box === 2) b2++;
      else if (rec.box === 3) b3++;
    });
    return { box1: b1, box2: b2, box3: b3 };
  }

  public getSummary(): ReviewStoreSummary {
    const dist = this.getBoxDistribution();
    const masteryPct = Math.round((dist.box3 / 6) * 100);
    const recommendations: string[] = [];

    if (dist.box3 === 6) {
      recommendations.push("All 6 bolt sequence nodes achieved Box 3 Mastery!");
    } else {
      const needsReview = this.getMissedBolts();
      if (needsReview.length > 0) {
        recommendations.push(`Priority review scheduled for Bolt(s): ${needsReview.join(", ")}`);
      }
      recommendations.push(`${dist.box3}/6 nodes mastered (${masteryPct}%). Continue progressive training.`);
    }

    return {
      totalBolts: 6,
      box1Count: dist.box1,
      box2Count: dist.box2,
      box3Count: dist.box3,
      masteryPercentage: masteryPct,
      recommendations
    };
  }
}
