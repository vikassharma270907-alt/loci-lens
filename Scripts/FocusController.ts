/**
 * TorqueLock AR — FocusController.ts
 * Manages Cognitive Load & Adaptive Level-of-Detail (LOD) Transitions.
 *
 * Grounded in:
 * - Lindlbauer et al. (UIST 2019): Context-aware UI adaptation cuts secondary task interactions by 36%.
 * - Henderson & Feiner (TVCG 2011): Separation of Comprehension (orienting) vs Psychomotor (action) phases.
 */

export type LODDisplayMode = "FULL_COMPREHENSION" | "COMPACT_FOCUS" | "ERROR_ALERT";

export interface FocusState {
  readonly mode: LODDisplayMode;
  readonly isFocusModeActive: boolean;
  readonly activeTagText: string;
  readonly showsTargetRing: boolean;
  readonly showsDetailedTag: boolean;
  readonly secondaryOpacity: number;
}

export class FocusController {
  private isFocusMode: boolean = false;
  private isErrorState: boolean = false;
  private currentFullText: string = "";
  private currentCompactText: string = "";
  private currentErrorText: string = "";

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.isFocusMode = false;
    this.isErrorState = false;
    this.currentFullText = "BOLT 1 OF 6 · PASS 1\nTARGET: 35 Nm SNUG";
    this.currentCompactText = "P1 · B1 · 35 Nm";
    this.currentErrorText = "";
  }

  public toggleFocusMode(): boolean {
    this.isFocusMode = !this.isFocusMode;
    return this.isFocusMode;
  }

  public setFocusMode(active: boolean): void {
    this.isFocusMode = active;
  }

  public setErrorAlert(hasError: boolean, errorText: string = ""): void {
    this.isErrorState = hasError;
    this.currentErrorText = errorText;
  }

  public updateTexts(fullText: string, compactText: string): void {
    this.currentFullText = fullText;
    this.currentCompactText = compactText;
  }

  public getState(): FocusState {
    if (this.isErrorState) {
      return {
        mode: "ERROR_ALERT",
        isFocusModeActive: this.isFocusMode,
        activeTagText: this.currentErrorText,
        showsTargetRing: true,
        showsDetailedTag: true,
        secondaryOpacity: 1.0
      };
    }

    if (this.isFocusMode) {
      return {
        mode: "COMPACT_FOCUS",
        isFocusModeActive: true,
        activeTagText: this.currentCompactText,
        showsTargetRing: true,
        showsDetailedTag: true,
        secondaryOpacity: 0.3
      };
    }

    return {
      mode: "FULL_COMPREHENSION",
      isFocusModeActive: false,
      activeTagText: this.currentFullText,
      showsTargetRing: true,
      showsDetailedTag: true,
      secondaryOpacity: 1.0
    };
  }
}
