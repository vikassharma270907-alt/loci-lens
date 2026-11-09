/**
 * Loci Lens - PeripheralHUD
 * Implements the non-intrusive glanceable HUD anchored in peripheral vision (Lu et al., 2020).
 * Displays session progress, mode indicator, and out-of-view locus orientation cues.
 */

import { Vector3 } from "./LocusAnchor";

export interface HUDState {
  modeName: string;
  totalCards: number;
  placedCount: number;
  testedCount: number;
  rememberedCount: number;
  accuracyPercentage: number;
  isDimmed: boolean;
  outOfViewAngleDeg?: number; // Defined when target locus is outside central 32° horizontal FOV
}

export class PeripheralHUD {
  // Physical placement in cm relative to head-worn camera
  // [x: +28 cm right, y: -20 cm down, z: -110 cm forward] ~ 18° peripheral offset
  public readonly defaultOffset: Vector3 = [28, -20, -110];
  public state: HUDState;

  constructor(totalCards: number = 6) {
    this.state = {
      modeName: "Onboard",
      totalCards,
      placedCount: 0,
      testedCount: 0,
      rememberedCount: 0,
      accuracyPercentage: 0,
      isDimmed: false
    };
  }

  public setMode(mode: string): void {
    this.state.modeName = mode;
  }

  public updateCounts(placed: number, tested: number, remembered: number): void {
    this.state.placedCount = placed;
    this.state.testedCount = tested;
    this.state.rememberedCount = remembered;
    this.state.accuracyPercentage =
      tested > 0 ? Math.round((remembered / tested) * 1000) / 10 : 0;
  }

  public setDimmed(dimmed: boolean): void {
    this.state.isDimmed = dimmed;
  }

  /**
   * Computes whether the next target locus is within the SPECS 32° horizontal FOV.
   * If outside, sets outOfViewAngleDeg to inform directional chevron rendering.
   */
  public evaluateDirectionHint(bearingRad: number): void {
    const halfFovRad = (32 / 2) * (Math.PI / 180); // 16° in radians
    if (Math.abs(bearingRad) > halfFovRad) {
      this.state.outOfViewAngleDeg = (bearingRad * 180) / Math.PI;
    } else {
      this.state.outOfViewAngleDeg = undefined;
    }
  }

  public getFormattedProgress(): string {
    if (this.state.modeName.toLowerCase() === "place") {
      return `Placed: ${this.state.placedCount}/${this.state.totalCards}`;
    }
    if (this.state.modeName.toLowerCase() === "test") {
      return `Tested: ${this.state.testedCount}/${this.state.totalCards} (${this.state.rememberedCount} Correct)`;
    }
    return `Cards: ${this.state.totalCards}`;
  }
}
