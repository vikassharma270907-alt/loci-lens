# TorqueLock AR — Implementation Tasks & Engineering Checklist

## Phase 0: Planning & Requirements Integration
- [x] **Task 0.1**: Ingest `TORQUELOCK_AR_INTEGRATED_MASTER_HANDOFF.md` completely, establishing authoritative requirements superseding prior Loci Lens instructions.
- [x] **Task 0.2**: Verify official Devpost Learn SPECS skill pack (`challengepost/learn-specs`) and maintain approved `devpost/design-brief.md`.
- [x] **Task 0.3**: Enforce technical boundaries: no real torque measurements or unverified gasket physics; reference ASME PCC-1 strictly for educational star-sequence training; display honest preview stand-in disclaimers.

## Phase 1: Pure TypeScript Domain Engine (`Assets/Scripts/`)
- [x] **Task 1.1**: Implement `SequenceEngine.ts` with pure TypeScript finite state machine, ASME PCC-1 star sequence ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$), three-pass torque ramp ($35, 70, 100\text{ Nm}$), and $1.8\text{ mm}$ gasket-warp deflection detection ($K_{\text{warp}} = 0.0514\text{ mm/Nm}$) with zero scene dependencies.
- [x] **Task 1.2**: Implement `MemoryTrainer.ts` encoding the 6 bolt loci with distinct spatial mnemonic cues for Learn, Recall, and Summary modes.
- [x] **Task 1.3**: Implement `FocusController.ts` cognitive Level-of-Detail (LOD) manager based on Henderson & Feiner (2011) and Lindlbauer et al. (2019), dynamically collapsing 2-line tags into 1-line eyes-up status pills during tool operation.
- [x] **Task 1.4**: Implement `ReviewStore.ts` with Leitner 3-box spaced repetition scoring and remediation tracking.

## Phase 2: Scene & Interaction Controllers
- [x] **Task 2.1**: Implement `FlangeSceneController.ts` generating 1:1 scale flange mesh ($42 \times 8 \times 42\text{ cm}$) at $(0, -18, -115)\text{ cm}$, six hex bolt nodes at exact centimeter coordinates, gasket crush plane, and $9\text{ cm}$ OD active target ring.
- [x] **Task 2.2**: Implement `SIKInteractionController.ts` with Spectacles Interaction Kit (SIK) pinch gesture routing, 3D bolt picking, and lower-field UI Kit buttons at $(0, -28, -105)\text{ cm}$ to prevent arm fatigue.
- [x] **Task 2.3**: Implement `PreviewSimulationController.ts` providing transparent simulated BLE torque wrench telemetry and disclaimer overlays.

## Phase 3: Automated Testing & Verification Framework
- [x] **Task 3.1**: Implement automated LEAF scenarios C1 through C6 in `Assets/Tests/TorqueLockScenarios.ts` and `Scripts/LEAFTests.ts`.
- [x] **Task 3.2**: Implement comprehensive Node.js unit test suite in `tests/torquelock.test.cjs`.
- [x] **Task 3.3**: Run automated test suite to achieve **100% test pass rate (20 / 20 tests passing in <100ms)**.
- [x] **Task 3.4**: Generate formal verification report in `docs/TEST_REPORT.md` and safety boundaries in `docs/KNOWN_LIMITATIONS.md`.

## Phase 4: Interactive Optical Preview Simulator
- [x] **Task 4.1**: Build standalone perspective Canvas simulator in `preview/index.html`, `preview/preview-runner.js`, and `preview/styles.css`.
- [x] **Task 4.2**: Model the Snap SPECS 27 optical display cone ($37^\circ\text{ V} \times 32^\circ\text{ H}$), focal plane at $1.15\text{ m}$, 3D flange wireframe, and 6 hex bolts.
- [x] **Task 4.3**: Integrate Web Audio synthesizer with spatial sound effects (ratchet clicks, torque chimes, gasket warp alarm buzzer, Leitner fanfare).
- [x] **Task 4.4**: Implement live in-browser automated LEAF scenario runner and Focus Mode toggle.
- [x] **Task 4.5**: Add preview HTTP server script to `package.json` (`npm run preview` -> `http://localhost:8080/`).

## Phase 5: Media Production & Devpost Submission Kit
- [x] **Task 5.1**: Synthesize professional narration audio clips using PowerShell Speech Synthesis (`generate_torquelock_audio.ps1`).
- [x] **Task 5.2**: Mix voiceovers and spatial audio sound effects with exact timeline metadata (`inspect_and_mix_torquelock_audio.py`).
- [x] **Task 5.3**: Render full 1080p 24fps walkthrough video (`torquelock_ar_demo_walkthrough.mp4`) in **2 minutes 22 seconds** (< 3 minutes hackathon limit).
- [x] **Task 5.4**: Generate synchronized video captions in SRT (`torquelock_demo_captions.srt`) and WebVTT (`torquelock_demo_captions.vtt`).
- [x] **Task 5.5**: Generate high-resolution 1280x720 YouTube thumbnail (`torquelock_ar_youtube_thumbnail.png`).
- [x] **Task 5.6**: Author complete, copy-paste ready Devpost submission text in `devpost/submission.md`.
- [x] **Task 5.7**: Author video description, tags, and pitch instructions in `DEMO_AND_SUBMISSION_PROMPT.md`.
- [x] **Task 5.8**: Update `RESEARCH_EVIDENCE.md` and `SOURCE_NOTES.md` documenting all 14 academic citations and ASME PCC-1 / OSHA standards.
- [x] **Task 5.9**: Verify all repository links and complete `HANDOFF_CHECKLIST.md`.
