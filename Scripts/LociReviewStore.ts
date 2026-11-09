import { LearningCard } from "./DeckData";

export interface ReviewStats {
  totalCards: number;
  testedCount: number;
  gotItCount: number;
  missedCount: number;
  accuracyPercentage: number;
}

export interface CardReviewRecord {
  cardId: string;
  box: 1 | 2 | 3;
  correctCount: number;
  missedCount: number;
  lastOutcome: "got_it" | "missed" | "untested";
  lastReviewedAt?: number;
}

export class LociReviewStore {
  private records: Map<string, CardReviewRecord> = new Map();

  constructor(cards: LearningCard[]) {
    this.initialize(cards);
  }

  public initialize(cards: LearningCard[]): void {
    this.records.clear();
    cards.forEach((c) => {
      this.records.set(c.id, {
        cardId: c.id,
        box: 1,
        correctCount: 0,
        missedCount: 0,
        lastOutcome: "untested"
      });
    });
  }

  public recordResult(cardId: string, outcome: "got_it" | "missed"): CardReviewRecord {
    const record = this.records.get(cardId);
    if (!record) throw new Error("Card not found");

    if (outcome === "got_it") {
      record.box = Math.min(3, record.box + 1) as 1 | 2 | 3;
      record.correctCount += 1;
    } else {
      record.box = 1;
      record.missedCount += 1;
    }
    record.lastOutcome = outcome;
    record.lastReviewedAt = Date.now();
    return record;
  }

  public getMissedCards(): string[] {
    return Array.from(this.records.values())
      .filter((r) => r.lastOutcome === "missed")
      .map((r) => r.cardId);
  }

  public getStats(): ReviewStats {
    const records = Array.from(this.records.values());
    let tested = 0;
    let gotIt = 0;
    let missed = 0;
    for (const r of records) {
      if (r.lastOutcome !== "untested") tested++;
      if (r.lastOutcome === "got_it") gotIt++;
      if (r.lastOutcome === "missed") missed++;
    }
    const accuracy = tested > 0 ? Math.round((gotIt / tested) * 1000) / 10 : 0;
    return {
      totalCards: records.length,
      testedCount: tested,
      gotItCount: gotIt,
      missedCount: missed,
      accuracyPercentage: accuracy
    };
  }

  public resetTestedState(): void {
    for (const r of this.records.values()) {
      r.lastOutcome = "untested";
    }
  }
}
