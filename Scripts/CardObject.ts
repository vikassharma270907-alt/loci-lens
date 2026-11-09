/**
 * Loci Lens - CardObject
 * Manages 3D billboard visual presentation, SUIK BackPlate contrast,
 * flip-to-reveal answer occlusion, and Got It / Missed feedback states.
 */

import { LearningCard } from "./DeckData";
import { LocusAnchor, Vector3 } from "./LocusAnchor";

export type CardVisualState = "icon_only" | "prompt_expanded" | "answer_revealed";

export class CardObject {
  public readonly card: LearningCard;
  public readonly anchor: LocusAnchor;

  public visualState: CardVisualState = "icon_only";
  public isAnswerRevealed: boolean = false;
  public lastResult?: "got_it" | "missed";
  public isFocused: boolean = false;

  // Dimensions in centimeters (Snap design best practice)
  public readonly widthCm: number = 32;
  public readonly heightCm: number = 22;

  constructor(card: LearningCard, initialPosition: Vector3) {
    this.card = card;
    this.anchor = new LocusAnchor({
      cardId: card.id,
      position: initialPosition,
      locusName: card.suggestedLocus
    });
  }

  public setFocused(focused: boolean): void {
    this.isFocused = focused;
  }

  public expandPrompt(): void {
    if (this.visualState === "icon_only") {
      this.visualState = "prompt_expanded";
    }
  }

  public revealAnswer(): void {
    this.isAnswerRevealed = true;
    this.visualState = "answer_revealed";
  }

  public hideAnswer(): void {
    this.isAnswerRevealed = false;
    this.visualState = "prompt_expanded";
  }

  public resetVisuals(): void {
    this.visualState = "icon_only";
    this.isAnswerRevealed = false;
    this.lastResult = undefined;
    this.isFocused = false;
  }

  public markResult(outcome: "got_it" | "missed"): void {
    this.lastResult = outcome;
  }

  public getBorderColorHex(): string {
    if (this.lastResult === "got_it") return "#22C55E"; // Emerald Green
    if (this.lastResult === "missed") return "#F59E0B"; // Amber
    if (this.isFocused) return "#38BDF8"; // Cyan focus
    return "#64748B"; // Slate neutral
  }
}
