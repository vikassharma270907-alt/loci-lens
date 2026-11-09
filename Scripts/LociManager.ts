/**
 * Loci Lens - LociManager
 * Master state machine and controller coordinating Onboard, Place, Stroll, Test, and Summary.
 */

import { DEMO_DECK, LearningCard } from "./DeckData";
import { ReviewStore, ReviewStats } from "./ReviewStore";
import { CardObject } from "./CardObject";
import { PeripheralHUD } from "./PeripheralHUD";
import { AudioFx } from "./AudioFx";
import { InputLayer } from "./InputLayer";
import { Vector3 } from "./LocusAnchor";

export type LensMode = "onboard" | "place" | "stroll" | "test" | "summary";

export class LociManager {
  public mode: LensMode = "onboard";
  public cards: LearningCard[];
  public cardObjects: CardObject[] = [];
  public reviewStore: ReviewStore;
  public hud: PeripheralHUD;
  public audio: AudioFx;
  public input: InputLayer;

  public activeCardIndex: number = 0;
  public placedCardCount: number = 0;

  // Staging / retest subset (for reviewing missed cards)
  public testDeckSubset: CardObject[] = [];
  public activeTestIndex: number = 0;

  // Camera pose simulation (for distance and FOV hints)
  public cameraPosition: Vector3 = [0, 160, 0]; // 160 cm standing eye level
  public cameraForward: Vector3 = [0, 0, -1];

  constructor(cards: LearningCard[] = DEMO_DECK) {
    this.cards = [...cards];
    this.reviewStore = new ReviewStore(this.cards);
    this.hud = new PeripheralHUD(this.cards.length);
    this.audio = new AudioFx();
    this.input = new InputLayer();

    this.initializeCardObjects();
  }

  private initializeCardObjects(): void {
    this.cardObjects = this.cards.map((card, idx) => {
      // Default radial room distribution for preview stand-in
      const angle = (idx / this.cards.length) * 2 * Math.PI;
      const radius = 180; // 1.8 meters radius in room
      const x = Math.round(Math.sin(angle) * radius);
      const z = Math.round(-Math.cos(angle) * radius);
      const y = 110; // 1.1 m comfortable desk/shelf height
      return new CardObject(card, [x, y, z]);
    });
  }

  public startPlacement(): void {
    this.mode = "place";
    this.hud.setMode("Place");
    this.activeCardIndex = 0;
    this.placedCardCount = 0;
    this.syncHUD();
  }

  public placeActiveCard(position: Vector3, normal: Vector3 = [0, 1, 0]): boolean {
    if (this.mode !== "place") return false;
    if (this.activeCardIndex >= this.cardObjects.length) return false;

    const activeObj = this.cardObjects[this.activeCardIndex];
    activeObj.anchor.bindToWorld(position, normal, activeObj.card.suggestedLocus);

    this.audio.playPlaceTone();
    this.placedCardCount++;
    this.activeCardIndex++;
    this.syncHUD();

    if (this.placedCardCount >= this.cardObjects.length) {
      // All cards placed -> automatically ready for Stroll or Test
      return true;
    }
    return false;
  }

  public startStroll(): void {
    this.mode = "stroll";
    this.hud.setMode("Stroll");
    this.cardObjects.forEach((co) => co.resetVisuals());
    this.syncHUD();
  }

  public startTest(onlyMissed: boolean = false): void {
    this.mode = "test";
    this.hud.setMode("Test");

    if (onlyMissed) {
      const missedIds = new Set(this.reviewStore.getMissedCards());
      this.testDeckSubset = this.cardObjects.filter((co) => missedIds.has(co.card.id));
    } else {
      this.testDeckSubset = [...this.cardObjects];
      this.reviewStore.resetTestedState();
    }

    this.activeTestIndex = 0;
    this.testDeckSubset.forEach((co) => co.resetVisuals());
    if (this.testDeckSubset.length > 0) {
      this.testDeckSubset[0].expandPrompt();
    }
    this.syncHUD();
  }

  public getActiveTestCard(): CardObject | undefined {
    if (this.mode !== "test") return undefined;
    if (this.activeTestIndex >= this.testDeckSubset.length) return undefined;
    return this.testDeckSubset[this.activeTestIndex];
  }

  public revealAnswer(): boolean {
    const active = this.getActiveTestCard();
    if (!active || active.isAnswerRevealed) return false;

    active.revealAnswer();
    this.audio.playRevealTone();
    return true;
  }

  public recordTestOutcome(outcome: "got_it" | "missed"): boolean {
    const active = this.getActiveTestCard();
    if (!active) return false;

    // Record in Leitner review store
    this.reviewStore.recordResult(active.card.id, outcome);
    active.markResult(outcome);

    if (outcome === "got_it") {
      this.audio.playSuccessTone();
    } else {
      this.audio.playMissedTone();
    }

    this.activeTestIndex++;
    this.syncHUD();

    if (this.activeTestIndex >= this.testDeckSubset.length) {
      this.openSummary();
      return true;
    } else {
      this.testDeckSubset[this.activeTestIndex].expandPrompt();
      return false;
    }
  }

  public openSummary(): void {
    this.mode = "summary";
    this.hud.setMode("Summary");
    this.syncHUD();
  }

  public retestMissed(): boolean {
    const missed = this.reviewStore.getMissedCards();
    if (missed.length === 0) return false;
    this.startTest(true);
    return true;
  }

  public resetAll(): void {
    this.reviewStore.initialize(this.cards);
    this.initializeCardObjects();
    this.mode = "onboard";
    this.hud.setMode("Onboard");
    this.activeCardIndex = 0;
    this.placedCardCount = 0;
    this.activeTestIndex = 0;
    this.testDeckSubset = [];
    this.syncHUD();
  }

  public updateCameraOrientation(pos: Vector3, forward: Vector3): void {
    this.cameraPosition = [...pos];
    this.cameraForward = [...forward];

    // Compute out-of-view cues for the target card in Test mode
    const target = this.getActiveTestCard();
    if (target) {
      const bearing = target.anchor.getBearingFrom(this.cameraPosition, this.cameraForward);
      this.hud.evaluateDirectionHint(bearing);
      if (this.hud.state.outOfViewAngleDeg !== undefined) {
        this.audio.playOutOfViewChime();
      }
    }
  }

  public getSummaryStats(): ReviewStats {
    return this.reviewStore.getStats();
  }

  private syncHUD(): void {
    const stats = this.reviewStore.getStats();
    this.hud.updateCounts(this.placedCardCount, stats.testedCount, stats.gotItCount);
  }
}
