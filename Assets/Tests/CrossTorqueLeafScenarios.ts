/**
 * CrossTorqueLeafScenarios.ts
 * Automated LEAF 2.0.2 test suite verifying all 5 Done Criteria in devpost/design-brief.md
 * plus a 6th ergonomic collider reach & rapid-pinch regression scenario.
 */

import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario";
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor";
import { findInteractableByName } from "Leaf.lspkg/Interactors/InteractableUtils";
import { findSceneObjectByName } from "Leaf.lspkg/Utils/common/Utils";
import { expect } from "Leaf.lspkg/Utils/common/Expect";
import { nextFrame, sleep } from "Leaf.lspkg/Utils/common/AsyncUtils";
import { CrossTorqueController } from "../Scripts/CrossTorqueController";
import { runCrossTorqueEngineSelfTests, STAR_SEQUENCE_ORDER } from "../Scripts/CrossTorqueEngine";

function getController(): CrossTorqueController {
  const root = findSceneObjectByName("CrossTorqueRoot");
  expect(root).toBeTruthy();
  const parent = root.getParent();
  expect(parent).toBeTruthy();
  const ctrl = parent.getComponent(CrossTorqueController.getTypeName()) as CrossTorqueController;
  expect(ctrl).toBeTruthy();
  return ctrl;
}

/**
 * Criterion 1: Initial 1:1 Spatial Layout & Star Target at Z = -110 cm
 */
@component
export class C1InitialLayoutScenario extends Scenario {
  public static getTypeName(): string {
    return "C1InitialLayoutScenario";
  }

  async run(): Promise<void> {
    const ctrl = getController();
    ctrl.setSimulatedCameraYawDeg(0);
    await nextFrame();

    // Verify pure TS domain math unit tests (22/22)
    const mathCheck = runCrossTorqueEngineSelfTests();
    expect(mathCheck.failures.length).toBe(0);
    expect(mathCheck.passed).toBeGreaterThan(20);

    // Verify PassBanner text and Z = -110 cm placement
    const bannerObj = findSceneObjectByName("PassBanner");
    expect(bannerObj).toBeTruthy();
    expect(bannerObj.enabled).toBeTruthy();
    const bannerZ = bannerObj.getTransform().getLocalPosition().z;
    expect(bannerZ).toBeCloseTo(-110.0);
    const bannerText = (bannerObj.getComponent("Component.Text") as Text).text;
    expect(bannerText).toBe("PASS 1 OF 3 · TARGET 35 Nm (SNUG)");

    // Verify ActiveHalo starts on Bolt_1 (0.0, +3.0, -108.5)
    const haloObj = findSceneObjectByName("ActiveHalo");
    expect(haloObj).toBeTruthy();
    expect(haloObj.enabled).toBeTruthy();
    const haloPos = haloObj.getTransform().getLocalPosition();
    expect(haloPos.x).toBeCloseTo(0.0);
    expect(haloPos.y).toBeCloseTo(3.0);

    // Verify DebriefCard and EdgeArrow are hidden at start
    expect(findSceneObjectByName("DebriefCard").enabled).toBeFalsy();
    expect(findSceneObjectByName("EdgeArrow").enabled).toBeFalsy();
  }
}

/**
 * Criterion 2: Star-Pattern Progression (1 -> 3 -> 5 -> 2 -> 4) Across Pass 1 (35 Nm)
 */
@component
export class C2StarProgressionScenario extends Scenario {
  public static getTypeName(): string {
    return "C2StarProgressionScenario";
  }

  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const haloObj = findSceneObjectByName("ActiveHalo");

    // Pinch Bolt_1 directly via SIK Interactable
    const bolt1 = findInteractableByName("Bolt_1");
    expect(bolt1).toBeTruthy();
    await interactor.trigger(bolt1);
    await nextFrame();

    // Assert Bolt_1 label updated to 35 Nm and ActiveHalo jumped across star chord to Bolt_3 (+6.5, -16.9)
    const bolt1Label = (findSceneObjectByName("Bolt_1_Label").getComponent("Component.Text") as Text).text;
    expect(bolt1Label).toBe("#1 · 35 Nm ✓");
    expect(haloObj.getTransform().getLocalPosition().x).toBeCloseTo(6.5);
    expect(haloObj.getTransform().getLocalPosition().y).toBeCloseTo(-16.9);

    // Complete remaining 4 bolts of Pass 1 (3 -> 5 -> 2 -> 4) using BtnTorquePulse
    const pulseBtn = findInteractableByName("BtnTorquePulse");
    expect(pulseBtn).toBeTruthy();
    for (let i = 0; i < 4; i++) {
      await interactor.trigger(pulseBtn);
      await nextFrame();
    }

    // Assert transition to Pass 2 (75 Nm) and ActiveHalo returned to Bolt_1
    const bannerText = (findSceneObjectByName("PassBanner").getComponent("Component.Text") as Text).text;
    expect(bannerText).toBe("PASS 2 OF 3 · TARGET 75 Nm (INTERMEDIATE)");
    expect(haloObj.getTransform().getLocalPosition().x).toBeCloseTo(0.0);
    expect(haloObj.getTransform().getLocalPosition().y).toBeCloseTo(3.0);
  }
}

/**
 * Criterion 3: Out-of-Sequence Adjacent Bolt Rejection & Warp Math (+0.24 mm)
 */
@component
export class C3AdjacentErrorRejectionScenario extends Scenario {
  public static getTypeName(): string {
    return "C3AdjacentErrorRejectionScenario";
  }

  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const ctrl = getController();

    // Ensure clean start at Pass 1, then tighten Bolt_1 so Bolt_3 is expected next
    const focusResetBtn = findInteractableByName("BtnFocusReset");
    if (findSceneObjectByName("DebriefCard").enabled) {
      await interactor.trigger(focusResetBtn);
      await nextFrame();
    } else {
      ctrl.handleBoltPinched(1);
      await nextFrame();
    }

    // Now attempt to pinch adjacent Bolt_2 instead of star-opposite Bolt_3
    const bolt2 = findInteractableByName("Bolt_2");
    expect(bolt2).toBeTruthy();
    await interactor.trigger(bolt2);
    await nextFrame();

    // Assert rejection message and verify ActiveHalo stayed locked on Bolt_3 (+6.5 cm X)
    const verdictText = (findSceneObjectByName("VerdictTag").getComponent("Component.Text") as Text).text;
    expect(verdictText).toBe("BLOCKED: ADJACENT BOLT #2 CAUSES +0.24 mm WARP — TORQUE #3 NEXT");
    const haloPos = findSceneObjectByName("ActiveHalo").getTransform().getLocalPosition();
    expect(haloPos.x).toBeCloseTo(6.5);
  }
}

/**
 * Criterion 4: Eyes-Up Focus Mode Progressive Disclosure & Off-Axis Edge Arrow
 */
@component
export class C4FocusAndEdgeArrowScenario extends Scenario {
  public static getTypeName(): string {
    return "C4FocusAndEdgeArrowScenario";
  }

  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const ctrl = getController();

    const focusBtn = findInteractableByName("BtnFocusReset");
    expect(focusBtn).toBeTruthy();

    // Toggle Focus Mode ON
    await interactor.trigger(focusBtn);
    await nextFrame();

    expect(findSceneObjectByName("PassBanner").enabled).toBeFalsy();
    expect(findSceneObjectByName("StarChord").enabled).toBeFalsy();
    expect(findSceneObjectByName("ActiveHalo").enabled).toBeTruthy();

    // Simulate user turning head 18 deg left while Bolt_3 (+6.5 cm) is active
    ctrl.setSimulatedCameraYawDeg(18.0);
    await sleep(50);

    const edgeArrow = findSceneObjectByName("EdgeArrow");
    expect(edgeArrow.enabled).toBeTruthy();
    const arrowText = (edgeArrow.getComponent("Component.Text") as Text).text;
    expect(arrowText).toBe("LOOK RIGHT >> BOLT #3");

    // Return gaze to center (0 deg) -> EdgeArrow hides automatically
    ctrl.setSimulatedCameraYawDeg(0.0);
    await nextFrame();
    expect(edgeArrow.enabled).toBeFalsy();

    // Toggle Focus Mode OFF
    await interactor.trigger(focusBtn);
    await nextFrame();
    expect(findSceneObjectByName("PassBanner").enabled).toBeTruthy();
  }
}

/**
 * Criterion 5: Full 3-Pass Completion (15 Steps -> 110 Nm) & Floor/Bench Debrief Reset
 */
@component
export class C5FullCompletionAndResetScenario extends Scenario {
  public static getTypeName(): string {
    return "C5FullCompletionAndResetScenario";
  }

  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();
    const pulseBtn = findInteractableByName("BtnTorquePulse");
    const resetBtn = findInteractableByName("BtnFocusReset");
    const debriefObj = findSceneObjectByName("DebriefCard");

    // Drive remaining valid steps until all 15 steps complete
    for (let step = 0; step < 15; step++) {
      if (debriefObj.enabled) {
        break;
      }
      await interactor.trigger(pulseBtn);
      await nextFrame();
    }

    expect(debriefObj.enabled).toBeTruthy();
    expect(findSceneObjectByName("ActiveHalo").enabled).toBeFalsy();
    const bolt5Label = (findSceneObjectByName("Bolt_5_Label").getComponent("Component.Text") as Text).text;
    expect(bolt5Label).toBe("#5 · 110 Nm ✓");

    // Trigger Reset from completed state
    await interactor.trigger(resetBtn);
    await nextFrame();

    expect(debriefObj.enabled).toBeFalsy();
    expect(findSceneObjectByName("ActiveHalo").enabled).toBeTruthy();
    const resetBanner = (findSceneObjectByName("PassBanner").getComponent("Component.Text") as Text).text;
    expect(resetBanner).toBe("PASS 1 OF 3 · TARGET 35 Nm (SNUG)");
  }
}

/**
 * Scenario 6: Ergonomic Dock Reach & Non-Overlapping Collider Guard
 */
@component
export class C6ErgonomicReachGuardScenario extends Scenario {
  public static getTypeName(): string {
    return "C6ErgonomicReachGuardScenario";
  }

  async run(): Promise<void> {
    const interactor = new DefaultLeafInteractor();

    // Verify all 5 bolts in star sequence can be directly pinched without dock collider interference
    for (const boltId of STAR_SEQUENCE_ORDER) {
      const boltInteractable = findInteractableByName(`Bolt_${boltId}`);
      expect(boltInteractable).toBeTruthy();
      await interactor.hover(boltInteractable, 60);
      await interactor.trigger(boltInteractable);
      await nextFrame();
    }

    const bannerText = (findSceneObjectByName("PassBanner").getComponent("Component.Text") as Text).text;
    expect(bannerText).toBe("PASS 2 OF 3 · TARGET 75 Nm (INTERMEDIATE)");
  }
}
