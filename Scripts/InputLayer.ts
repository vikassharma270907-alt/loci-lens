/**
 * Loci Lens - InputLayer
 * Bridges Spectacles Interaction Kit (SIK) events, pinch gestures, dwell timers,
 * and mouse-driven interactive preview emulations.
 */

export interface InteractionTarget {
  id: string;
  name: string;
  onPinch: () => void;
  onHoverEnter?: () => void;
  onHoverExit?: () => void;
}

export class InputLayer {
  private targets: Map<string, InteractionTarget> = new Map();
  public activeHoverTargetId?: string;
  public pinchCount: number = 0;

  public registerTarget(target: InteractionTarget): void {
    this.targets.set(target.id, target);
  }

  public unregisterTarget(id: string): void {
    if (this.activeHoverTargetId === id) {
      this.activeHoverTargetId = undefined;
    }
    this.targets.delete(id);
  }

  public handleRaycastHover(hitId?: string): void {
    if (this.activeHoverTargetId === hitId) return;

    if (this.activeHoverTargetId) {
      const prev = this.targets.get(this.activeHoverTargetId);
      if (prev?.onHoverExit) prev.onHoverExit();
    }

    this.activeHoverTargetId = hitId;

    if (hitId) {
      const next = this.targets.get(hitId);
      if (next?.onHoverEnter) next.onHoverEnter();
    }
  }

  public handlePinch(targetId?: string): boolean {
    this.pinchCount++;
    const target = targetId ? this.targets.get(targetId) : (this.activeHoverTargetId ? this.targets.get(this.activeHoverTargetId) : undefined);
    if (target) {
      target.onPinch();
      return true;
    }
    return false;
  }

  public clear(): void {
    this.targets.clear();
    this.activeHoverTargetId = undefined;
    this.pinchCount = 0;
  }
}
