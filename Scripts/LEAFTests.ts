// Assets/Tests/TorqueLockScenarios.ts
/**
 * TorqueLock AR — Automated LEAF Testing Suite (Leaf.lspkg)
 *
 * Implements 6 Automated LEAF Scenarios verifying Done Criteria C1 through C6:
 * - C1: Initial Spatial Layout & Star Target #1
 * - C2: Comprehension-to-Psychomotor LOD Transition & Star Advance
 * - C3: Out-of-Sequence Gasket Warp Alert & Off-Axis Recovery
 * - C4: Focus Mode Progressive Disclosure (Lindlbauer et al. 2019)
 * - C5: Full Star Pass Transition & Multi-Pass Progression
 * - C6: Ergonomic Reachability (IkBodyInteractor / Evangelista Belo et al. 2021)
 */

import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { scenariosIndex } from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator";
import { ScenarioMetadata } from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata";
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import { IkBodyInteractor } from "Leaf.lspkg/Interactors/interactor/IkBodyInteractor";
import { findInteractableByName } from "Leaf.lspkg/Interactors/InteractableUtils";
import { findSceneObjectByName } from "Leaf.lspkg/Utils/common/Utils";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { sleep, nextFrame } from "Leaf.lspkg/Utils/common/AsyncUtils";

@component
export class C1_InitialSpatialLayoutScenario extends Scenario {
  async run(): Promise<void> {
    await nextFrame();
    const flange = findSceneObjectByName("FlangeWorkbenchAssembly");
    const ring = findSceneObjectByName("ActiveTargetRing");
    const tagText = findSceneObjectByName("ActiveBoltSpecTag").getComponent("Component.Text").text;

    expect(flange).toBeTruthy();
    expect(ring).toBeTruthy();

    // Verify ActiveTargetRing starts anchored on BoltNode_1 at Z = -130 cm
    const ringPos = ring.getTransform().getWorldPosition();
    expect(ringPos.z).toBeCloseTo(-130.0, 1);
    expect(tagText).toBe("BOLT 1 OF 6 · PASS 1\nTARGET: 35 Nm SNUG");
  }
}

@component
export class C2_StarSequenceAdvanceScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const btnApply = findInteractableByName("BtnApplyTorque");
    expect(btnApply).toBeTruthy();

    // Pinch Apply Torque to complete Bolt 1 (12 o'clock) and jump across center to Bolt 4 (6 o'clock)
    await interactor.trigger(btnApply);
    await sleep(250);

    const ringPos = findSceneObjectByName("ActiveTargetRing").getTransform().getWorldPosition();
    const tagText = findSceneObjectByName("ActiveBoltSpecTag").getComponent("Component.Text").text;

    // Bolt 4 is at (0, -14, -100)
    expect(ringPos.z).toBeCloseTo(-100.0, 1);
    expect(tagText).toBe("BOLT 2 OF 6 · PASS 1\nTARGET: 35 Nm SNUG");
  }
}

@component
export class C3_GasketWarpAndRecoveryScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const btnError = findInteractableByName("BtnSimError");
    const btnApply = findInteractableByName("BtnApplyTorque");
    expect(btnError).toBeTruthy();

    // Simulate out-of-sequence bolt wrenching
    await interactor.trigger(btnError);
    await sleep(250);

    const warpArrow = findSceneObjectByName("PeripheralWarpArrow");
    const warpBanner = findSceneObjectByName("WarpBannerText").getComponent("Component.Text").text;

    expect(warpArrow.enabled).toBeTruthy();
    expect(warpBanner).toBe("!! SEQUENCE ERROR: UNDO BOLT 2 (-35 Nm) !!");

    // Relieve the out-of-sequence bolt via BtnApplyTorque
    await interactor.trigger(btnApply);
    await sleep(250);

    expect(warpArrow.enabled).toBeFalsy();
  }
}

@component
export class C4_FocusModeProgressiveDisclosureScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const btnFocus = findInteractableByName("BtnFocusMode");
    expect(btnFocus).toBeTruthy();

    await interactor.trigger(btnFocus);
    await sleep(200);

    const compactText = findSceneObjectByName("ActiveBoltSpecTag").getComponent("Component.Text").text;
    // Verify 2-line comprehension tag collapses to 1-line minimal LOD pill
    expect(compactText).toBe("P1 · B1 · 35 Nm");

    // Toggle back to Comprehension mode
    await interactor.trigger(btnFocus);
    await sleep(200);

    const fullText = findSceneObjectByName("ActiveBoltSpecTag").getComponent("Component.Text").text;
    expect(fullText).toBe("BOLT 1 OF 6 · PASS 1\nTARGET: 35 Nm SNUG");
  }
}

@component
export class C5_FullStarPassTransitionScenario extends Scenario {
  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const btnApply = findInteractableByName("BtnApplyTorque");
    expect(btnApply).toBeTruthy();

    // Complete all 6 bolts in Pass 1 (1 -> 4 -> 2 -> 5 -> 3 -> 6)
    for (let step = 0; step < 6; step++) {
      await interactor.trigger(btnApply);
      await sleep(180);
    }

    const tagText = findSceneObjectByName("ActiveBoltSpecTag").getComponent("Component.Text").text;
    const ringPos = findSceneObjectByName("ActiveTargetRing").getTransform().getWorldPosition();

    // Should now be on Pass 2 (70 Nm INTERMEDIATE) back at Bolt 1 (Z = -130 cm)
    expect(ringPos.z).toBeCloseTo(-130.0, 1);
    expect(tagText).toBe("BOLT 1 OF 6 · PASS 2\nTARGET: 70 Nm INTERMEDIATE");
  }
}

@component
export class C6_ErgonomicReachScenario extends Scenario {
  async run(): Promise<void> {
    const bodyInteractor = new IkBodyInteractor();
    const btnApply = findInteractableByName("BtnApplyTorque");
    expect(btnApply).toBeTruthy();

    // Verify simulated human arm can physically reach and trigger the lower-field dock at z = -105 cm
    await bodyInteractor.trigger(btnApply);
    await sleep(250);

    const ringPos = findSceneObjectByName("ActiveTargetRing").getTransform().getWorldPosition();
    expect(ringPos.z).toBeCloseTo(-100.0, 1);
  }
}

@component
export class TorqueLockLeafIndex extends BaseScriptComponent {
  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    { id: "c1_initial_layout", typename: C1_InitialSpatialLayoutScenario.getTypeName() },
    { id: "c2_star_advance", typename: C2_StarSequenceAdvanceScenario.getTypeName() },
    { id: "c3_gasket_warp_recovery", typename: C3_GasketWarpAndRecoveryScenario.getTypeName() },
    { id: "c4_focus_mode_lod", typename: C4_FocusModeProgressiveDisclosureScenario.getTypeName() },
    { id: "c5_full_pass_transition", typename: C5_FullStarPassTransitionScenario.getTypeName() },
    { id: "c6_ergonomic_reach", typename: C6_ErgonomicReachScenario.getTypeName() }
  ];
}
