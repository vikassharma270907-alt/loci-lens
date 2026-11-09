/**
 * TorqueLock AR — PreviewSimulationController.ts
 * Honest Preview Sensor Stand-In Controller for Lens Studio Interactive Preview.
 *
 * Implements:
 * - Transparent on-screen disclaimer: "PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH".
 * - "SIMULATION MODE — NO REAL TORQUE MEASUREMENT" banner.
 * - Bridges mouse clicks and simulated SIK raycasts to the pure TypeScript engine.
 */

import { TorqueEngine, FlangeSnapshot } from "./SequenceEngine";
import { MemoryTrainer } from "./MemoryTrainer";
import { SIKInteractionController, InteractionEventResult } from "./SIKInteractionController";

export class PreviewSimulationController {
  public static readonly DISCLAIMER_TEXT = "PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH";
  public static readonly SAFETY_NOTICE = "SIMULATION MODE — NO REAL TORQUE MEASUREMENT";

  private engine: TorqueEngine;
  private trainer: MemoryTrainer;
  private interaction: SIKInteractionController;

  constructor(
    engine: TorqueEngine,
    trainer: MemoryTrainer,
    interaction: SIKInteractionController
  ) {
    this.engine = engine;
    this.trainer = trainer;
    this.interaction = interaction;
  }

  public getDisclaimer(): string {
    return PreviewSimulationController.DISCLAIMER_TEXT;
  }

  public getSafetyNotice(): string {
    return PreviewSimulationController.SAFETY_NOTICE;
  }

  public simulateApplyTorque(): InteractionEventResult {
    return this.interaction.onBtnApplyTorque();
  }

  public simulateWrongBoltSelection(): InteractionEventResult {
    return this.interaction.onBtnSimError();
  }

  public simulateFocusModeToggle(): InteractionEventResult {
    return this.interaction.onBtnFocusMode();
  }

  public simulateBoltPinch(boltId: number): InteractionEventResult {
    return this.interaction.onPinchBoltNode(boltId);
  }

  public simulateReset(): InteractionEventResult {
    return this.interaction.onResetSession();
  }

  public getSnapshot(): FlangeSnapshot {
    return this.engine.getSnapshot();
  }
}
