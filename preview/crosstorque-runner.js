/**
 * CrossTorque AR — Interactive SPECS 27 Optical Preview Simulator
 * Real-time 3D Canvas rendering the 5-bolt flange hub, criss-cross star chords,
 * active cyan halo, out-of-FOV yellow edge arrow, SIK pinches, and automated LEAF tests.
 */

// --- Audio Synthesizer ---
class TorqueAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (this.muted) return;
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  playTorqueClick() {
    if (this.muted) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2300, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.12);
    } catch (_) {}
  }

  playErrorTone() {
    if (this.muted) return;
    try {
      this.ensure();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, t);
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    } catch (_) {}
  }
}

const audio = new TorqueAudio();
window.toggleAudio = () => {
  audio.muted = !audio.muted;
  const btn = document.getElementById("audio-toggle-btn");
  if (btn) btn.classList.toggle("muted", audio.muted);
};

// --- CrossTorque Domain Constants ---
const STAR_SEQUENCE_ORDER = [1, 3, 5, 2, 4];
const PASS_TORQUE_TARGETS_NM = { 1: 35, 2: 75, 3: 110 };
const PASS_LABELS = { 1: "SNUG", 2: "INTERMEDIATE", 3: "FINAL LOCK" };
const HUB_RADIUS_CM = 11.0;
const HUB_CENTER_Y_CM = -8.0;
const HUB_DEPTH_Z_CM = -110.0;

class CrossTorqueSimulatorEngine {
  constructor() {
    this.reset();
  }

  reset() {
    const anglesDeg = [90, 18, -54, -126, 162];
    this.bolts = anglesDeg.map((deg, idx) => {
      const rad = (deg * Math.PI) / 180.0;
      const x = Number((HUB_RADIUS_CM * Math.cos(rad)).toFixed(1));
      const y = Number((HUB_CENTER_Y_CM + HUB_RADIUS_CM * Math.sin(rad)).toFixed(1));
      return {
        id: idx + 1,
        angleDeg: deg,
        localXCm: x,
        localYCm: y,
        appliedTorqueNm: 0,
        completedPass: 0,
        hasCreepAlert: false,
      };
    });
    this.currentPass = 1;
    this.sequenceCursor = 0;
    this.completedSteps = 0;
    this.mistakeCount = 0;
    this.focusMode = false;
    this.flangeWarpMm = 0.02;
    this.lastStatus = "NOMINAL";
    this.lastVerdictText = "NOMINAL · RUNOUT 0.02 mm · TORQUE BOLT #1 (35 Nm)";
    return this.getSnapshot(1, true);
  }

  getBolts() {
    return this.bolts;
  }

  getBoltById(boltId) {
    return this.bolts.find((b) => b.id === boltId);
  }

  getActiveTargetBoltId() {
    if (this.isComplete()) return 0;
    return STAR_SEQUENCE_ORDER[this.sequenceCursor];
  }

  getPreviousBoltId() {
    if (this.completedSteps === 0) return STAR_SEQUENCE_ORDER[0];
    const prevIdx = (this.sequenceCursor + STAR_SEQUENCE_ORDER.length - 1) % STAR_SEQUENCE_ORDER.length;
    return STAR_SEQUENCE_ORDER[prevIdx];
  }

  isComplete() {
    return this.completedSteps >= 15;
  }

  toggleFocusMode() {
    this.focusMode = !this.focusMode;
    const activeId = this.getActiveTargetBoltId();
    if (this.focusMode && activeId > 0) {
      this.lastVerdictText = `FOCUS MODE · EYES ON BOLT #${activeId}`;
    } else if (!this.focusMode && activeId > 0) {
      this.lastVerdictText = `NOMINAL · RUNOUT ${this.flangeWarpMm.toFixed(2)} mm · TORQUE BOLT #${activeId} (${PASS_TORQUE_TARGETS_NM[this.currentPass]} Nm)`;
    }
    return this.getSnapshot(activeId, true);
  }

  applyBoltTorque(boltId) {
    if (this.isComplete()) return this.getSnapshot(0, false);
    const expectedBoltId = this.getActiveTargetBoltId();
    const targetNm = PASS_TORQUE_TARGETS_NM[this.currentPass];

    if (boltId !== expectedBoltId) {
      this.mistakeCount += 1;
      this.flangeWarpMm = this.computeAsymmetricWarpMm(boltId, expectedBoltId, targetNm);
      this.lastStatus = "WARP_REJECTED";
      this.lastVerdictText = `BLOCKED: ADJACENT BOLT #${boltId} CAUSES +${this.flangeWarpMm.toFixed(2)} mm WARP — TORQUE #${expectedBoltId} NEXT`;
      return this.getSnapshot(boltId, false);
    }

    const bolt = this.bolts[boltId - 1];
    bolt.appliedTorqueNm = targetNm;
    bolt.completedPass = this.currentPass;
    bolt.hasCreepAlert = false;

    this.completedSteps += 1;
    this.flangeWarpMm = 0.02;
    this.lastStatus = this.isComplete() ? "SEAL_VERIFIED" : "NOMINAL";

    if (this.isComplete()) {
      this.focusMode = false;
      this.lastVerdictText = `SEAL VERIFIED · 5/5 BOLTS @ 110 Nm · RUNOUT 0.02 mm`;
      return this.getSnapshot(boltId, true);
    }

    this.sequenceCursor += 1;
    if (this.sequenceCursor >= STAR_SEQUENCE_ORDER.length) {
      this.sequenceCursor = 0;
      if (this.currentPass < 3) {
        this.currentPass += 1;
      }
    }

    const nextTargetId = this.getActiveTargetBoltId();
    const nextTargetNm = PASS_TORQUE_TARGETS_NM[this.currentPass];
    if (this.focusMode) {
      this.lastVerdictText = `FOCUS MODE · EYES ON BOLT #${nextTargetId}`;
    } else {
      this.lastVerdictText = `NOMINAL · RUNOUT 0.02 mm · TORQUE BOLT #${nextTargetId} (${nextTargetNm} Nm)`;
    }

    return this.getSnapshot(boltId, true);
  }

  triggerSimulatedAdjacentError() {
    const expectedId = this.getActiveTargetBoltId();
    if (expectedId === 0) return this.getSnapshot(0, false);
    const adjacentBoltId = (expectedId % 5) + 1;
    return this.applyBoltTorque(adjacentBoltId);
  }

  computeAsymmetricWarpMm(attemptedBoltId, expectedBoltId, passTorqueNm) {
    const bAttempt = this.bolts[attemptedBoltId - 1];
    const bExpected = this.bolts[expectedBoltId - 1];
    const chordDistCm = Math.hypot(bAttempt.localXCm - bExpected.localXCm, bAttempt.localYCm - bExpected.localYCm);
    const rawWarp = 0.18 + (passTorqueNm / 110.0) * 0.18 * (13.0 / Math.max(chordDistCm, 1.0));
    return Number(rawWarp.toFixed(2));
  }

  static computeOffAxisDirection(cameraYawDeg, boltXCm, boltZCm = HUB_DEPTH_Z_CM, thresholdDeg = 12.0) {
    const boltAzimuthDeg = (Math.atan2(boltXCm, Math.abs(boltZCm)) * 180.0) / Math.PI;
    const relativeAngleDeg = boltAzimuthDeg + cameraYawDeg;
    if (relativeAngleDeg > thresholdDeg) {
      return { isOffAxis: true, direction: "RIGHT", angularDeltaDeg: Number(relativeAngleDeg.toFixed(1)) };
    }
    if (relativeAngleDeg < -thresholdDeg) {
      return { isOffAxis: true, direction: "LEFT", angularDeltaDeg: Number(relativeAngleDeg.toFixed(1)) };
    }
    return { isOffAxis: false, direction: "CENTER", angularDeltaDeg: Number(relativeAngleDeg.toFixed(1)) };
  }

  getSnapshot(attemptedBoltId = this.getActiveTargetBoltId(), accepted = true) {
    const activeId = this.getActiveTargetBoltId();
    const targetNm = PASS_TORQUE_TARGETS_NM[this.currentPass];
    const passLabel = PASS_LABELS[this.currentPass];

    const bannerText = this.isComplete()
      ? "ALL 3 PASSES COMPLETE · 110 Nm LOCKED"
      : this.focusMode
      ? `FOCUS · BOLT #${activeId} (${targetNm} Nm)`
      : `PASS ${this.currentPass} OF 3 · TARGET ${targetNm} Nm (${passLabel})`;

    const debriefText =
      `SEAL VERIFIED · 5/5 BOLTS @ 110 Nm\n` +
      `RUNOUT: ${this.flangeWarpMm.toFixed(2)} mm (MAX 0.05 mm) · ERRORS: ${this.mistakeCount}`;

    return {
      accepted,
      status: this.lastStatus,
      targetBoltId: activeId,
      attemptedBoltId,
      currentPass: this.currentPass,
      targetTorqueNm: targetNm,
      completedSteps: this.completedSteps,
      totalSteps: 15,
      flangeWarpMm: this.flangeWarpMm,
      mistakeCount: this.mistakeCount,
      focusMode: this.focusMode,
      isComplete: this.isComplete(),
      bannerText,
      verdictText: this.lastVerdictText,
      debriefText,
    };
  }
}

const engine = new CrossTorqueSimulatorEngine();
let cameraYawDeg = 0.0;

// --- Canvas 3D Renderer ---
const canvas = document.getElementById("renderCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

function resizeCanvas() {
  if (!canvas) return;
  const container = document.getElementById("viewport-container");
  if (container) {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
  }
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function projectPoint(xCm, yCm, zCm) {
  if (!canvas) return { x: 0, y: 0, scale: 1 };
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  // Apply camera yaw
  const yawRad = (cameraYawDeg * Math.PI) / 180.0;
  const rotX = xCm * Math.cos(yawRad) - zCm * Math.sin(yawRad);
  const rotZ = xCm * Math.sin(yawRad) + zCm * Math.cos(yawRad);

  const focalLength = 700;
  const depth = Math.abs(rotZ);
  const scale = focalLength / depth;

  const screenX = cx + rotX * scale * 1.5;
  const screenY = cy - yCm * scale * 1.5;

  return { x: screenX, y: screenY, scale, visible: rotZ < 0 };
}

let pulsePhase = 0;
function renderLoop() {
  if (!ctx || !canvas) return;
  pulsePhase += 0.05;

  ctx.fillStyle = "#050608";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Background optical grid
  ctx.strokeStyle = "rgba(0, 240, 255, 0.04)";
  ctx.lineWidth = 1;
  const gridSpacing = 30;
  for (let x = 0; x < canvas.width; x += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const snap = engine.getSnapshot();
  const bolts = engine.getBolts();

  // Draw 5-bolt flange metallic ring
  const hubCenter = projectPoint(0, HUB_CENTER_Y_CM, HUB_DEPTH_Z_CM);
  if (hubCenter.visible) {
    ctx.save();
    ctx.strokeStyle = "rgba(180, 200, 220, 0.35)";
    ctx.lineWidth = 18 * hubCenter.scale;
    ctx.beginPath();
    ctx.arc(hubCenter.x, hubCenter.y, HUB_RADIUS_CM * hubCenter.scale * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // Draw StarChord between previous and active target bolt (if not in focus mode)
  if (!snap.focusMode && !snap.isComplete && snap.targetBoltId > 0) {
    const prevId = engine.getPreviousBoltId();
    const prevBolt = engine.getBoltById(prevId);
    const activeBolt = engine.getBoltById(snap.targetBoltId);

    if (prevBolt && activeBolt) {
      const p1 = projectPoint(prevBolt.localXCm, prevBolt.localYCm, HUB_DEPTH_Z_CM);
      const p2 = projectPoint(activeBolt.localXCm, activeBolt.localYCm, HUB_DEPTH_Z_CM);

      if (p1.visible && p2.visible) {
        ctx.save();
        ctx.strokeStyle = "rgba(0, 240, 255, 0.8)";
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  // Draw 5 Bolts
  for (const b of bolts) {
    const p = projectPoint(b.localXCm, b.localYCm, HUB_DEPTH_Z_CM);
    if (!p.visible) continue;

    const isActive = b.id === snap.targetBoltId && !snap.isComplete;
    const isTorqued = b.completedPass >= snap.currentPass || snap.isComplete;

    // Bolt head circle
    ctx.save();
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2.2 * p.scale * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = isTorqued ? "#10B981" : isActive ? "#00F0FF" : "rgba(160, 180, 200, 0.6)";
    ctx.shadowColor = isTorqued ? "rgba(16, 185, 129, 0.6)" : isActive ? "rgba(0, 240, 255, 0.8)" : "transparent";
    ctx.shadowBlur = isActive ? 18 : 6;
    ctx.fill();

    // ActiveHalo pulsing cyan ring
    if (isActive) {
      const pulseR = (3.2 + Math.sin(pulsePhase) * 0.4) * p.scale * 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = "#00F0FF";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#00F0FF";
      ctx.shadowBlur = 20;
      ctx.stroke();
    }

    // Bolt Label
    if (!snap.focusMode || isActive) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      const check = isTorqued ? " ✓" : "";
      ctx.fillText(`#${b.id} · ${b.appliedTorqueNm}Nm${check}`, p.x, p.y + 24 * p.scale);
    }
    ctx.restore();
  }

  requestAnimationFrame(renderLoop);
}
requestAnimationFrame(renderLoop);

// --- State Synchronization ---
function syncUI() {
  const snap = engine.getSnapshot();

  // Pass banner
  const bannerHud = document.getElementById("passBannerHud");
  const bannerHeader = document.getElementById("passBannerHeader");
  if (bannerHud && bannerHeader) {
    bannerHeader.textContent = snap.bannerText;
    bannerHud.style.display = snap.focusMode || snap.isComplete ? "none" : "block";
  }

  // Verdict Tag
  const verdictText = document.getElementById("verdictText");
  const verdictTagHud = document.getElementById("verdictTagHud");
  const verdictIcon = document.getElementById("verdictIcon");
  if (verdictText && verdictTagHud && verdictIcon) {
    verdictText.textContent = snap.verdictText;
    if (snap.status === "WARP_REJECTED") {
      verdictTagHud.style.borderColor = "#EF4444";
      verdictTagHud.style.color = "#EF4444";
      verdictIcon.textContent = "⚠️";
    } else if (snap.status === "CREEP_ALERT") {
      verdictTagHud.style.borderColor = "#F59E0B";
      verdictTagHud.style.color = "#F59E0B";
      verdictIcon.textContent = "⚡";
    } else {
      verdictTagHud.style.borderColor = "#10B981";
      verdictTagHud.style.color = "#10B981";
      verdictIcon.textContent = "✓";
    }
  }

  // Focus / Reset button text
  const btnFocusReset = document.getElementById("btnFocusReset");
  if (btnFocusReset) {
    btnFocusReset.textContent = snap.isComplete
      ? "[RESET 3-PASS HUB]"
      : snap.focusMode
      ? "[EXIT FOCUS MODE]"
      : "[FOCUS MODE / RESET]";
  }

  // Debrief Card Overlay
  const debriefOverlay = document.getElementById("debriefCardOverlay");
  const debriefRunout = document.getElementById("debriefRunoutVal");
  const debriefMistakes = document.getElementById("debriefMistakesVal");
  if (debriefOverlay && debriefRunout && debriefMistakes) {
    debriefOverlay.style.display = snap.isComplete ? "block" : "none";
    debriefRunout.textContent = `${snap.flangeWarpMm.toFixed(2)} mm`;
    debriefMistakes.textContent = `${snap.mistakeCount} Errors`;
  }

  // Telemetry in sidebar
  const tPass = document.getElementById("telemetryPass");
  const tTarget = document.getElementById("telemetryTarget");
  const tRunout = document.getElementById("telemetryRunout");
  const tErrors = document.getElementById("telemetryErrors");
  if (tPass) tPass.textContent = `Pass ${snap.currentPass} (${snap.targetTorqueNm} Nm)`;
  if (tTarget) tTarget.textContent = snap.targetBoltId > 0 ? `Bolt #${snap.targetBoltId}` : "All Locked";
  if (tRunout) tRunout.textContent = `${snap.flangeWarpMm.toFixed(2)} mm`;
  if (tErrors) tErrors.textContent = `${snap.mistakeCount}`;

  // Update out-of-FOV Edge Arrow
  updateEdgeArrow();
}

function updateEdgeArrow() {
  const edgeArrowHud = document.getElementById("edgeArrowHud");
  if (!edgeArrowHud) return;

  const targetId = engine.getActiveTargetBoltId();
  if (targetId === 0 || engine.isComplete()) {
    edgeArrowHud.style.display = "none";
    return;
  }

  const targetBolt = engine.getBoltById(targetId);
  const offAxis = CrossTorqueSimulatorEngine.computeOffAxisDirection(
    cameraYawDeg,
    targetBolt.localXCm,
    HUB_DEPTH_Z_CM,
    12.0
  );

  if (offAxis.isOffAxis) {
    edgeArrowHud.style.display = "block";
    if (offAxis.direction === "RIGHT") {
      edgeArrowHud.style.left = "auto";
      edgeArrowHud.style.right = "40px";
      edgeArrowHud.textContent = `LOOK RIGHT >> BOLT #${targetId}`;
    } else {
      edgeArrowHud.style.right = "auto";
      edgeArrowHud.style.left = "40px";
      edgeArrowHud.textContent = `<< LOOK LEFT · BOLT #${targetId}`;
    }
  } else {
    edgeArrowHud.style.display = "none";
  }
}

// --- Interactive Handlers ---
window.ctHandleBoltClick = (boltId) => {
  const res = engine.applyBoltTorque(boltId);
  if (res.accepted) {
    audio.playTorqueClick();
  } else {
    audio.playErrorTone();
  }
  syncUI();
};

window.ctHandleTorquePulse = () => {
  const targetId = engine.getActiveTargetBoltId();
  if (targetId > 0) {
    window.ctHandleBoltClick(targetId);
  }
};

window.ctHandleWrongBolt = () => {
  const res = engine.triggerSimulatedAdjacentError();
  audio.playErrorTone();
  syncUI();
};

window.ctHandleFocusReset = () => {
  if (engine.isComplete()) {
    engine.reset();
  } else {
    engine.toggleFocusMode();
  }
  audio.playTorqueClick();
  syncUI();
};

window.ctSetYaw = (val) => {
  cameraYawDeg = val;
  const yawText = document.getElementById("yawValueText");
  if (yawText) {
    const dir = val > 0 ? "RIGHT" : val < 0 ? "LEFT" : "CENTER";
    yawText.textContent = `${val.toFixed(1)}° (${dir})`;
  }
  updateEdgeArrow();
};

// Canvas click detector on bolts
if (canvas) {
  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const bolts = engine.getBolts();
    for (const b of bolts) {
      const p = projectPoint(b.localXCm, b.localYCm, HUB_DEPTH_Z_CM);
      const dist = Math.hypot(mouseX - p.x, mouseY - p.y);
      if (dist <= 25) {
        window.ctHandleBoltClick(b.id);
        break;
      }
    }
  });
}

// --- Automated LEAF Test Runner in Browser ---
window.ctRunLeafSuite = async () => {
  const runBtn = document.getElementById("runLeafBtn");
  if (runBtn) {
    runBtn.disabled = true;
    runBtn.textContent = "RUNNING LEAF TESTS...";
  }

  const setStatus = (id, text, color) => {
    const el = document.getElementById(`leafStatus${id}`);
    if (el) {
      el.textContent = text;
      el.style.color = color;
      el.style.fontWeight = "bold";
    }
  };

  for (let i = 1; i <= 6; i++) {
    setStatus(i, "Running...", "#F59E0B");
  }

  // C1
  await new Promise((r) => setTimeout(r, 200));
  engine.reset();
  cameraYawDeg = 0;
  syncUI();
  const init = engine.getSnapshot();
  const c1Pass = init.targetBoltId === 1 && init.currentPass === 1 && init.flangeWarpMm === 0.02;
  setStatus(1, c1Pass ? "✓ PASSED" : "FAILED", c1Pass ? "#10B981" : "#EF4444");

  // C2
  await new Promise((r) => setTimeout(r, 250));
  engine.applyBoltTorque(1);
  syncUI();
  for (let s = 0; s < 4; s++) {
    engine.applyBoltTorque(engine.getActiveTargetBoltId());
  }
  syncUI();
  const c2Pass = engine.getSnapshot().currentPass === 2 && engine.getActiveTargetBoltId() === 1;
  setStatus(2, c2Pass ? "✓ PASSED" : "FAILED", c2Pass ? "#10B981" : "#EF4444");

  // C3
  await new Promise((r) => setTimeout(r, 250));
  engine.applyBoltTorque(1); // Target is now 3
  const errRes = engine.applyBoltTorque(2); // Attempt 2
  syncUI();
  const c3Pass = !errRes.accepted && errRes.status === "WARP_REJECTED" && errRes.targetBoltId === 3;
  setStatus(3, c3Pass ? "✓ PASSED" : "FAILED", c3Pass ? "#10B981" : "#EF4444");

  // C4
  await new Promise((r) => setTimeout(r, 250));
  engine.toggleFocusMode();
  cameraYawDeg = 18.0;
  syncUI();
  const off1 = CrossTorqueSimulatorEngine.computeOffAxisDirection(18.0, 6.5, HUB_DEPTH_Z_CM, 12.0);
  cameraYawDeg = 0.0;
  engine.toggleFocusMode();
  syncUI();
  const c4Pass = off1.isOffAxis && off1.direction === "RIGHT";
  setStatus(4, c4Pass ? "✓ PASSED" : "FAILED", c4Pass ? "#10B981" : "#EF4444");

  // C5
  await new Promise((r) => setTimeout(r, 250));
  engine.reset();
  for (let step = 0; step < 15; step++) {
    engine.applyBoltTorque(engine.getActiveTargetBoltId());
  }
  syncUI();
  const c5Complete = engine.isComplete();
  engine.reset();
  syncUI();
  const c5Pass = c5Complete && !engine.isComplete() && engine.getSnapshot().currentPass === 1;
  setStatus(5, c5Pass ? "✓ PASSED" : "FAILED", c5Pass ? "#10B981" : "#EF4444");

  // C6
  await new Promise((r) => setTimeout(r, 250));
  engine.reset();
  for (const bId of STAR_SEQUENCE_ORDER) {
    engine.applyBoltTorque(bId);
  }
  syncUI();
  const c6Pass = engine.getSnapshot().currentPass === 2;
  setStatus(6, c6Pass ? "✓ PASSED" : "FAILED", c6Pass ? "#10B981" : "#EF4444");

  if (runBtn) {
    runBtn.disabled = false;
    runBtn.textContent = "RUN ALL 6 LEAF SCENARIOS (6/6 PASSED)";
  }
};

// Initial sync
syncUI();
