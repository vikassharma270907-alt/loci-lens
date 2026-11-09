/**
 * CrossTorqueController.ts
 * Main Lens Studio 5.23.2 SPECS Scene Controller for CrossTorque AR.
 * Uses Spectacles Interaction Kit (SIK) Interactables, procedural MeshBuilder geometry,
 * additive-display high-luminance palettes, and CrossTorqueEngine.ts.
 */

import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable";
import { InteractorEvent } from "SpectaclesInteractionKit.lspkg/Core/Interactor/InteractorEvent";
import {
  CrossTorqueEngine,
  STAR_SEQUENCE_ORDER,
  HUB_CENTER_Y_CM,
  HUB_DEPTH_Z_CM,
  TorqueStepResult,
  runCrossTorqueEngineSelfTests,
} from "./CrossTorqueEngine";

@component
export class CrossTorqueController extends BaseScriptComponent {
  public static getTypeName(): string {
    return "CrossTorqueController";
  }

  @input
  @allowUndefined
  public headCamera?: SceneObject;

  @input
  @allowUndefined
  public baseUnlitMaterial?: Material;

  @input
  @allowUndefined
  public sfxAudio?: AudioComponent;

  private engine: CrossTorqueEngine = new CrossTorqueEngine();

  // Stable SceneObject references for LEAF findSceneObjectByName / findInteractableByName
  private rootAnchor!: SceneObject;
  private passBannerObj!: SceneObject;
  private passBannerText!: Text;
  private verdictTagObj!: SceneObject;
  private verdictTagText!: Text;
  private activeHaloObj!: SceneObject;
  private starChordObj!: SceneObject;
  private edgeArrowObj!: SceneObject;
  private edgeArrowText!: Text;
  private debriefCardObj!: SceneObject;
  private debriefCardText!: Text;

  private boltObjects: Map<number, SceneObject> = new Map();
  private boltLabelTexts: Map<number, Text> = new Map();

  private btnTorquePulseObj!: SceneObject;
  private btnWrongBoltObj!: SceneObject;
  private btnFocusResetObj!: SceneObject;
  private btnFocusResetText!: Text;

  // Simulated camera yaw override for deterministic LEAF testing without fighting DeviceTracking
  private simulatedYawOverrideDeg: number | null = null;

  onAwake(): void {
    const selfTest = runCrossTorqueEngineSelfTests();
    print(`[CrossTorque] Engine Self-Tests: ${selfTest.passed}/${selfTest.total} PASSED`);
    if (selfTest.failures.length > 0) {
      print(`[CrossTorque] Self-Test Failures: ${selfTest.failures.join("; ")}`);
    }

    if (this.sfxAudio) {
      this.sfxAudio.playbackMode = Audio.PlaybackMode.LowLatency;
    }

    this.buildOrBindSceneHierarchy();
    this.createEvent("OnStartEvent").bind(() => this.onStart());
    this.createEvent("UpdateEvent").bind(() => this.onUpdate());
  }

  private onStart(): void {
    this.wireInteractables();
    const initialSnap = this.engine.reset();
    this.syncSceneToSnapshot(initialSnap);
    print("[CrossTorque] Scene initialized at Z = -110 cm. Ready for SIK pinch interactions.");
  }

  private onUpdate(): void {
    this.updateOutOfFovEdgeArrow();
  }

  /**
   * Builds or binds stable named SceneObjects so LEAF tests can query them deterministically
   * via findSceneObjectByName() and findInteractableByName().
   */
  private buildOrBindSceneHierarchy(): void {
    this.rootAnchor = this.findOrCreateObject("CrossTorqueRoot", this.getSceneObject(), new vec3(0, 0, 0));

    // Pass Banner above the hub (Y = +16 cm, Z = -110 cm) — leaving Eye Level (Y = 0 cm) 100% clear
    this.passBannerObj = this.findOrCreateObject("PassBanner", this.rootAnchor, new vec3(0, 16.0, HUB_DEPTH_Z_CM));
    this.passBannerText = this.getOrAddText(
      this.passBannerObj,
      "PASS 1 OF 3 · TARGET 35 Nm (SNUG)",
      38,
      new vec4(0.07, 0.94, 1.0, 1.0)
    );

    // 5-Bolt Hub Container at (0, -8, -110)
    const hubObj = this.findOrCreateObject("FlangeHub", this.rootAnchor, new vec3(0, 0, 0));
    this.buildProceduralRingMesh(hubObj, new vec3(0, HUB_CENTER_Y_CM, HUB_DEPTH_Z_CM), 9.2, 12.8);

    // Create the 5 Bolt SceneObjects with SIK Interactables & 6.5 x 6.5 x 4.0 cm BoxColliders
    for (const boltState of this.engine.getBolts()) {
      const boltName = `Bolt_${boltState.id}`;
      const boltPos = new vec3(boltState.localXCm, boltState.localYCm, HUB_DEPTH_Z_CM);
      const boltObj = this.findOrCreateObject(boltName, hubObj, boltPos);
      this.ensureInteractableWithBoxCollider(boltObj, new vec3(6.5, 6.5, 4.0));
      this.buildProceduralBoltMesh(boltObj, 2.2);

      const labelObj = this.findOrCreateObject(`${boltName}_Label`, boltObj, new vec3(0, 0, 2.2));
      const txt = this.getOrAddText(labelObj, `#${boltState.id} · 0 Nm`, 28, new vec4(1.0, 1.0, 1.0, 1.0));

      this.boltObjects.set(boltState.id, boltObj);
      this.boltLabelTexts.set(boltState.id, txt);
    }

    // Active Bolt Target Halo (snaps to target bolt at Z = -108.5 cm)
    const b1 = this.engine.getBoltById(1);
    this.activeHaloObj = this.findOrCreateObject(
      "ActiveHalo",
      this.rootAnchor,
      new vec3(b1.localXCm, b1.localYCm, HUB_DEPTH_Z_CM + 1.5)
    );
    this.buildProceduralRingMesh(this.activeHaloObj, new vec3(0, 0, 0), 2.8, 3.8);
    this.getOrAddText(this.activeHaloObj, "TARGET", 22, new vec4(0.0, 0.95, 1.0, 1.0));

    // Star Vector Chord Line between previous and active bolt
    this.starChordObj = this.findOrCreateObject(
      "StarChord",
      this.rootAnchor,
      new vec3(0, HUB_CENTER_Y_CM, HUB_DEPTH_Z_CM + 1.0)
    );
    this.getOrAddText(this.starChordObj, "STAR CHORD: #1 -> #3", 22, new vec4(0.07, 0.94, 1.0, 0.95));

    // Verdict / Warp Tag below the hub (0, -22.5, -108)
    this.verdictTagObj = this.findOrCreateObject("VerdictTag", this.rootAnchor, new vec3(0, -22.5, -108.0));
    this.verdictTagText = this.getOrAddText(
      this.verdictTagObj,
      "NOMINAL · RUNOUT 0.02 mm · TORQUE BOLT #1 (35 Nm)",
      26,
      new vec4(0.51, 0.95, 0.62, 1.0)
    );

    // Out-of-FOV Edge Arrow at (+21, -6, -95) — hidden by default
    this.edgeArrowObj = this.findOrCreateObject("EdgeArrow", this.rootAnchor, new vec3(21.0, -6.0, -95.0));
    this.edgeArrowText = this.getOrAddText(
      this.edgeArrowObj,
      "LOOK RIGHT >> BOLT #3",
      32,
      new vec4(1.0, 0.9, 0.0, 1.0)
    );
    this.edgeArrowObj.enabled = false;

    // Completion Debrief Card at (0, -10, -105) — hidden until all 15 steps complete
    this.debriefCardObj = this.findOrCreateObject("DebriefCard", this.rootAnchor, new vec3(0, -10.0, -105.0));
    this.debriefCardText = this.getOrAddText(
      this.debriefCardObj,
      "SEAL VERIFIED · 5/5 BOLTS @ 110 Nm",
      30,
      new vec4(0.07, 0.94, 1.0, 1.0)
    );
    this.debriefCardObj.enabled = false;

    // Ergonomic Lower-Field Control Dock at Y = -29 cm, Z = -95 cm (Three 15.0 x 7.5 cm SIK buttons)
    const dockObj = this.findOrCreateObject("ControlDock", this.rootAnchor, new vec3(0, -29.0, -95.0));

    this.btnTorquePulseObj = this.findOrCreateObject("BtnTorquePulse", dockObj, new vec3(-16.5, 0, 0));
    this.ensureInteractableWithBoxCollider(this.btnTorquePulseObj, new vec3(15.0, 7.5, 3.0));
    this.getOrAddText(this.btnTorquePulseObj, "[TORQUE NEXT BOLT]", 24, new vec4(0.07, 0.94, 1.0, 1.0));

    this.btnWrongBoltObj = this.findOrCreateObject("BtnWrongBolt", dockObj, new vec3(0.0, 0, 0));
    this.ensureInteractableWithBoxCollider(this.btnWrongBoltObj, new vec3(15.0, 7.5, 3.0));
    this.getOrAddText(this.btnWrongBoltObj, "[SIMULATE WRONG BOLT]", 22, new vec4(1.0, 0.72, 0.2, 1.0));

    this.btnFocusResetObj = this.findOrCreateObject("BtnFocusReset", dockObj, new vec3(16.5, 0, 0));
    this.ensureInteractableWithBoxCollider(this.btnFocusResetObj, new vec3(15.0, 7.5, 3.0));
    this.btnFocusResetText = this.getOrAddText(
      this.btnFocusResetObj,
      "[FOCUS MODE / RESET]",
      22,
      new vec4(1.0, 1.0, 1.0, 1.0)
    );
  }

  /**
   * Wires SIK Interactable.onTriggerEnd callbacks for all 5 bolts and 3 dock buttons.
   * Both direct bolt pinches and dock button pinches call the exact same underlying engine methods.
   */
  private wireInteractables(): void {
    for (let id = 1; id <= 5; id++) {
      const boltObj = this.boltObjects.get(id);
      if (boltObj) {
        const interactable = boltObj.getComponent(Interactable.getTypeName()) as Interactable;
        if (interactable && interactable.onTriggerEnd) {
          interactable.onTriggerEnd.add((_e: InteractorEvent) => {
            this.handleBoltPinched(id);
          });
        }
      }
    }

    const pulseInteractable = this.btnTorquePulseObj.getComponent(Interactable.getTypeName()) as Interactable;
    if (pulseInteractable && pulseInteractable.onTriggerEnd) {
      pulseInteractable.onTriggerEnd.add((_e: InteractorEvent) => {
        this.handleTorquePulseButton();
      });
    }

    const wrongInteractable = this.btnWrongBoltObj.getComponent(Interactable.getTypeName()) as Interactable;
    if (wrongInteractable && wrongInteractable.onTriggerEnd) {
      wrongInteractable.onTriggerEnd.add((_e: InteractorEvent) => {
        this.handleWrongBoltButton();
      });
    }

    const focusResetInteractable = this.btnFocusResetObj.getComponent(Interactable.getTypeName()) as Interactable;
    if (focusResetInteractable && focusResetInteractable.onTriggerEnd) {
      focusResetInteractable.onTriggerEnd.add((_e: InteractorEvent) => {
        this.handleFocusOrResetButton();
      });
    }
  }

  public handleBoltPinched(boltId: number): TorqueStepResult {
    const result = this.engine.applyBoltTorque(boltId);
    this.playFeedbackSfx();
    this.syncSceneToSnapshot(result);
    print(`[CrossTorque] Bolt #${boltId} pinched -> accepted=${result.accepted} | ${result.verdictText}`);
    return result;
  }

  public handleTorquePulseButton(): TorqueStepResult {
    const targetId = this.engine.getActiveTargetBoltId();
    if (targetId === 0) {
      return this.engine.getSnapshot();
    }
    return this.handleBoltPinched(targetId);
  }

  public handleWrongBoltButton(): TorqueStepResult {
    const result = this.engine.triggerSimulatedAdjacentError();
    this.playFeedbackSfx();
    this.syncSceneToSnapshot(result);
    print(`[CrossTorque] Simulated adjacent error -> ${result.verdictText}`);
    return result;
  }

  public handleFocusOrResetButton(): TorqueStepResult {
    let result: TorqueStepResult;
    if (this.engine.isComplete()) {
      result = this.engine.reset();
      print("[CrossTorque] Sequence reset to Pass 1 of 3.");
    } else {
      result = this.engine.toggleFocusMode();
      print(`[CrossTorque] Focus Mode toggled -> focusMode=${result.focusMode}`);
    }
    this.playFeedbackSfx();
    this.syncSceneToSnapshot(result);
    return result;
  }

  /**
   * Synchronizes all world-space text, colors, visibility flags, and 3D transforms
   * to the deterministic engine snapshot.
   */
  private syncSceneToSnapshot(snap: TorqueStepResult): void {
    // 1. Update Pass Banner & Progressive Disclosure (Focus Mode)
    this.passBannerText.text = snap.bannerText;
    this.passBannerObj.enabled = !snap.focusMode && !snap.isComplete;

    // 2. Update each bolt's torque readout and visibility
    for (const b of this.engine.getBolts()) {
      const lbl = this.boltLabelTexts.get(b.id);
      if (lbl) {
        const checkMark = b.completedPass >= snap.currentPass || snap.isComplete ? " ✓" : "";
        lbl.text = `#${b.id} · ${b.appliedTorqueNm} Nm${checkMark}`;
        // In Focus Mode, hide non-active bolt text labels to eliminate visual clutter
        lbl.enabled = !snap.focusMode || b.id === snap.targetBoltId;
      }
    }

    // 3. Position ActiveHalo on the current target bolt
    if (snap.isComplete || snap.targetBoltId === 0) {
      this.activeHaloObj.enabled = false;
      this.starChordObj.enabled = false;
    } else {
      const targetBolt = this.engine.getBoltById(snap.targetBoltId);
      this.activeHaloObj.enabled = true;
      this.activeHaloObj
        .getTransform()
        .setLocalPosition(new vec3(targetBolt.localXCm, targetBolt.localYCm, HUB_DEPTH_Z_CM + 1.5));

      const prevId = this.engine.getPreviousBoltId();
      const nextIdx = (STAR_SEQUENCE_ORDER.indexOf(snap.targetBoltId) + 1) % STAR_SEQUENCE_ORDER.length;
      const afterId = STAR_SEQUENCE_ORDER[nextIdx];
      const chordText = this.starChordObj.getComponent("Component.Text") as Text;
      if (chordText) {
        chordText.text = `STAR CHORD: #${prevId} -> #${snap.targetBoltId} (NEXT #${afterId})`;
      }
      this.starChordObj.enabled = !snap.focusMode;
    }

    // 4. Update VerdictTag text and additive color coding
    this.verdictTagText.text = snap.verdictText;
    if (snap.status === "WARP_REJECTED") {
      this.verdictTagText.textFill.color = new vec4(1.0, 0.28, 0.25, 1.0); // High-luminance Coral Red
    } else if (snap.status === "CREEP_ALERT") {
      this.verdictTagText.textFill.color = new vec4(1.0, 0.85, 0.0, 1.0); // Bright Amber
    } else {
      this.verdictTagText.textFill.color = new vec4(0.51, 0.95, 0.62, 1.0); // Bright Mint Green
    }

    // 5. Update Completion Debrief Card and Focus/Reset Button label
    this.debriefCardObj.enabled = snap.isComplete;
    this.debriefCardText.text = snap.debriefText;
    this.btnFocusResetText.text = snap.isComplete
      ? "[RESET 3-PASS HUB]"
      : snap.focusMode
      ? "[EXIT FOCUS MODE]"
      : "[FOCUS MODE / RESET]";

    this.updateOutOfFovEdgeArrow();
  }

  /**
   * Checks camera yaw orientation against the active target bolt and enables/disables
   * the yellow EdgeArrow when the target bolt falls outside the +/-12 deg central gaze cone.
   */
  private updateOutOfFovEdgeArrow(): void {
    const targetId = this.engine.getActiveTargetBoltId();
    if (targetId === 0 || this.engine.isComplete()) {
      this.edgeArrowObj.enabled = false;
      return;
    }
    const targetBolt = this.engine.getBoltById(targetId);
    const yawDeg = this.getCurrentCameraYawDeg();
    const offAxis = CrossTorqueEngine.computeOffAxisDirection(
      yawDeg,
      targetBolt.localXCm,
      HUB_DEPTH_Z_CM,
      12.0
    );

    if (offAxis.isOffAxis) {
      this.edgeArrowObj.enabled = true;
      const xPos = offAxis.direction === "RIGHT" ? 21.0 : -21.0;
      this.edgeArrowObj.getTransform().setLocalPosition(new vec3(xPos, -6.0, -95.0));
      this.edgeArrowText.text =
        offAxis.direction === "RIGHT"
          ? `LOOK RIGHT >> BOLT #${targetId}`
          : `<< LOOK LEFT · BOLT #${targetId}`;
    } else {
      this.edgeArrowObj.enabled = false;
    }
  }

  public setSimulatedCameraYawDeg(yawDeg: number | null): void {
    this.simulatedYawOverrideDeg = yawDeg;
    this.updateOutOfFovEdgeArrow();
  }

  private getCurrentCameraYawDeg(): number {
    if (this.simulatedYawOverrideDeg !== null) {
      return this.simulatedYawOverrideDeg;
    }
    if (!this.headCamera) {
      return 0;
    }
    const forward = this.headCamera.getTransform().forward;
    return (Math.atan2(forward.x, -forward.z) * 180.0) / Math.PI;
  }

  private playFeedbackSfx(): void {
    if (this.sfxAudio && this.sfxAudio.audioTrack) {
      this.sfxAudio.play(1);
    }
  }

  // --- Scene Construction Helpers ---
  private findOrCreateObject(name: string, parent: SceneObject, localPos: vec3): SceneObject {
    const count = parent.getChildrenCount();
    for (let i = 0; i < count; i++) {
      const child = parent.getChild(i);
      if (child.name === name) {
        child.getTransform().setLocalPosition(localPos);
        return child;
      }
    }
    const obj = global.scene.createSceneObject(name);
    obj.setParent(parent);
    obj.getTransform().setLocalPosition(localPos);
    return obj;
  }

  private getOrAddText(obj: SceneObject, content: string, size: number, color: vec4): Text {
    let txt = obj.getComponent("Component.Text") as Text;
    if (!txt) {
      txt = obj.createComponent("Component.Text") as Text;
    }
    txt.text = content;
    txt.size = size;
    txt.textFill = {
      mode: TextFillMode.Solid,
      color: color,
    };
    return txt;
  }

  private ensureInteractableWithBoxCollider(obj: SceneObject, boxSizeCm: vec3): Interactable {
    let collider = obj.getComponent("Physics.ColliderComponent") as ColliderComponent;
    if (!collider) {
      collider = obj.createComponent("Physics.ColliderComponent") as ColliderComponent;
    }
    const box = Shape.createBoxShape();
    box.size = boxSizeCm;
    collider.shape = box;

    let interactable = obj.getComponent(Interactable.getTypeName()) as Interactable;
    if (!interactable) {
      interactable = obj.createComponent(Interactable.getTypeName()) as Interactable;
    }
    return interactable;
  }

  private buildProceduralRingMesh(targetObj: SceneObject, offset: vec3, innerR: number, outerR: number): void {
    const builder = new MeshBuilder([{ name: "position", components: 3 }]);
    builder.topology = MeshTopology.Triangles;
    const segments = 24;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      builder.appendVerticesInterleaved([
        offset.x + innerR * cos,
        offset.y + innerR * sin,
        offset.z,
        offset.x + outerR * cos,
        offset.y + outerR * sin,
        offset.z,
      ]);
      if (i < segments) {
        const base = i * 2;
        builder.appendIndices([base, base + 1, base + 2, base + 1, base + 3, base + 2]);
      }
    }
    if (builder.isValid()) {
      builder.updateMesh();
      let rmv = targetObj.getComponent("Component.RenderMeshVisual") as RenderMeshVisual;
      if (!rmv) {
        rmv = targetObj.createComponent("Component.RenderMeshVisual") as RenderMeshVisual;
      }
      rmv.mesh = builder.getMesh();
      if (this.baseUnlitMaterial) {
        rmv.mainMaterial = this.baseUnlitMaterial;
      }
    }
  }

  private buildProceduralBoltMesh(targetObj: SceneObject, radiusCm: number): void {
    this.buildProceduralRingMesh(targetObj, new vec3(0, 0, 0), 0.4, radiusCm);
  }
}
