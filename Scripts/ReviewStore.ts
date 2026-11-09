/**
 * Loci Lens - ReviewStore
 * Implements the Leitner 3-Box Spaced Repetition engine and session retention statistics.
 * Box 1 = Active / Needs Review
 * Box 2 = Intermediate Retention
 * Box 3 = Mastered
 */

import { LearningCard, DEMO_DECK } from "./DeckData";

export interface ReviewRecord {
  cardId: string;
  box: 1 | 2 | 3;
  correctCount: number;
  missedCount: number;
  lastOutcome: "got_it" | "missed" | "untested";
  lastReviewedAt?: number;
}

export interface ReviewStats {
  totalCards: number;
  testedCount: number;
  gotItCount: number;
  missedCount: number;
  accuracyPercentage: number;
  boxCounts: {
    box1: number;
    box2: number;
    box3: number;
  };
}

export class ReviewStore {
  private records: Map<string, ReviewRecord> = new Map();

  constructor(cards: LearningCard[] = DEMO_DECK) {
    this.initialize(cards);
  }

  public initialize(cards: LearningCard[]): void {
    this.records.clear();
    cards.forEach((card) => {
      this.records.set(card.id, {
        cardId: card.id,
        box: 1,
        correctCount: 0,
        missedCount: 0,
        lastOutcome: "untested"
      });
    });
  }

  public recordResult(cardId: string, outcome: "got_it" | "missed"): ReviewRecord {
    const existing = this.records.get(cardId);
    if (!existing) {
      throw new Error(`ReviewStore: Card ID "${cardId}" not found in active deck.`);
    }

    const now = Date.now();
    let newBox: 1 | 2 | 3 = existing.box;

    if (outcome === "got_it") {
      newBox = Math.min(3, existing.box + 1) as 1 | 2 | 3;
      existing.correctCount += 1;
    } else {
      // Missed items demote immediately to Box 1 for rapid re-acquisition
      newBox = 1;
      existing.missedCount += 1;
    }

    existing.box = newBox;
    existing.lastOutcome = outcome;
    existing.lastReviewedAt = now;

    this.records.set(cardId, { ...existing });
    return existing;
  }

  public getRecord(cardId: string): ReviewRecord | undefined {
    return this.records.get(cardId);
  }

  public getAllRecords(): ReviewRecord[] {
    return Array.from(this.records.values());
  }

  public getMissedCards(): string[] {
    return Array.from(this.records.values())
      .filter((r) => r.lastOutcome === "missed")
      .map((r) => r.cardId);
  }

  public getMasteredCards(): string[] {
    return Array.from(this.records.values())
      .filter((r) => r.box === 3)
      .map((r) => r.cardId);
  }

  public getStats(): ReviewStats {
    const records = Array.from(this.records.values());
    const totalCards = records.length;
    let testedCount = 0;
    let gotItCount = 0;
    let missedCount = 0;
    let box1 = 0;
    let box2 = 0;
    let box3 = 0;

    for (const r of records) {
      if (r.lastOutcome !== "untested") {
        testedCount++;
      }
      if (r.lastOutcome === "got_it") {
        gotItCount++;
      } else if (r.lastOutcome === "missed") {
        missedCount++;
      }

      if (r.box === 1) box1++;
      else if (r.box === 2) box2++;
      else if (r.box === 3) box3++;
    }

    const accuracyPercentage =
      testedCount > 0 ? Math.round((gotItCount / testedCount) * 1000) / 10 : 0;

    return {
      totalCards,
      testedCount,
      gotItCount,
      missedCount,
      accuracyPercentage,
      boxCounts: { box1, box2, box3 }
    };
  }

  public resetTestedState(): void {
    for (const record of this.records.values()) {
      record.lastOutcome = "untested";
    }
  }
}
