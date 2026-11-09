/**
 * TorqueLock AR — SIKInteractionController.ts
 * Spectacles Interaction Kit (SIK) Event Router for Hand-Tracking Pinch & UI Buttons.
 *
 * Implements:
 * - Direct 3D raycast pinch selection on hexagonal bolt targets.
 * - Foreground UI Kit button event routing with collision priority over 3D props.
 * - Prevents dual-trigger race conditions in Interactive Preview and on hardware.
 */

import { TorqueEngine, FlangeSnapshot } from "./SequenceEngine";
import { MemoryTrainer, RecallResult } from "./MemoryTrainer";
import { FocusController } from "./FocusController";
import { FlangeSceneController } from "./FlangeSceneController";

export interface InteractionEventResult {
  readonly action: string;
  readonly success: boolean;
  readonly snapshot: FlangeSnapshot;
  readonly recallResult?: RecallResult;
}

export class SIKInteractionController {
  private engine: TorqueEngine;
  private trainer: MemoryTrainer;
  private focus: FocusController;
  private scene: FlangeSceneController;
  private lastTriggerTimestamp: number = 0;
  private readonly DEBOUNCE_MS = 100;

  constructor(
    engine: TorqueEngine,
    trainer: MemoryTrainer,
    focus: FocusController,
    scene: FlangeSceneController
  ) {
    this.engine = engine;
    this.trainer = trainer;
    this.focus = focus;
    this.scene = scene;
  }

  /**
   * Primary handler for SIK Pinch on a 3D Bolt Node (BoltNode_1 to BoltNode_6).
   */
  public onPinchBoltNode(boltId: number): InteractionEventResult {
    const now = Date.now();
    if (now - this.lastTriggerTimestamp < this.DEBOUNCE_MS) {
      return { action: "debounce_ignored", success: false, snapshot: this.engine.getSnapshot() };
    }
    this.lastTriggerTimestamp = now;

    const currentMode = this.trainer.getMode();

    if (currentMode === "LEARN") {
      this.trainer.advanceLearnStep();
      const snap = this.scene.updateScene();
      return {
        action: `learn_bolt_inspected_${boltId}`,
        success: true,
        snapshot: snap
      };
    } else if (currentMode === "RECALL") {
      const recallRes = this.trainer.submitRecallAnswer(boltId);
      const snap = this.scene.updateScene();
      return {
        action: `recall_bolt_${boltId}`,
        success: recallRes.isCorrect,
        snapshot: snap,
        recallResult: recallRes
      };
    } else {
      // PRACTISE mode
      this.engine.torqueSpecificBolt(boltId);
      const snap = this.scene.updateScene();
      return {
        action: `practice_bolt_${boltId}`,
        success: snap.lodPhase !== "WARP_ALERT",
        snapshot: snap
      };
    }
  }

  /**
   * Primary handler for Lower-Field UI Kit Button: BtnApplyTorque
   */
  public onBtnApplyTorque(): InteractionEventResult {
    const snap = this.engine.applyTorqueToActiveOrRelieve();
    this.scene.updateScene();

    if (snap.isFlangeSealed) {
      this.trainer.markPracticeCompleted();
    }

    return {
      action: "btn_apply_torque",
      success: true,
      snapshot: snap
    };
  }

  /**
   * Primary handler for Lower-Field UI Kit Button: BtnSimError
   */
  public onBtnSimError(): InteractionEventResult {
    const snap = this.engine.simulateWrongBolt();
    this.scene.updateScene();
    return {
      action: "btn_sim_wrong_bolt",
      success: true,
      snapshot: snap
    };
  }

  /**
   * Primary handler for Lower-Field UI Kit Button: BtnFocusMode
   */
  public onBtnFocusMode(): InteractionEventResult {
    const isFocus = this.focus.toggleFocusMode();
    this.engine.toggleFocusMode();
    const snap = this.scene.updateScene();
    return {
      action: `btn_focus_mode_${isFocus ? "enabled" : "disabled"}`,
      success: true,
      snapshot: snap
    };
  }

  /**
   * Reset the entire session across all modules.
   */
  public onResetSession(): InteractionEventResult {
    this.trainer.reset();
    this.focus.reset();
    const snap = this.engine.reset();
    this.scene.updateScene();
    return {
      action: "session_reset",
      success: true,
      snapshot: snap
    };
  }
}
