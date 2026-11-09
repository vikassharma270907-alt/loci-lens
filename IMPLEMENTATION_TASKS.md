# Loci Lens — Implementation Tasks & Engineering Checklist

## Phase 0: Setup, Planning & Environment Validation
- [x] **Task 0.1**: Inspect development environment, verify Node.js (v24), Git, and directory structure.
- [x] **Task 0.2**: Install and inspect Devpost Learn SPECS skill pack (`challengepost/learn-specs`).
- [x] **Task 0.3**: Generate formal planning authority at `devpost/design-brief.md` adhering strictly to template.
- [x] **Task 0.4**: Configure `.mcp.json` and Lens Studio project definitions.

## Phase 1: Core Architecture & Data Engine
- [x] **Task 1.1**: Implement `DeckData.ts` with 6-card multi-disciplinary memory curriculum.
- [x] **Task 1.2**: Implement `ReviewStore.ts` with Leitner 3-box spaced repetition scoring and statistics.
- [x] **Task 1.3**: Implement `LocusAnchor.ts` handling world spatial coordinates and raycast placement fallbacks.
- [x] **Task 1.4**: Implement `LociManager.ts` master state machine (Onboard → Place → Stroll → Test → Summary).
- [x] **Task 1.5**: Implement `CardObject.ts` for 3D billboard rendering, additive contrast, and flip-to-reveal mechanics.
- [x] **Task 1.6**: Implement `PeripheralHUD.ts` adhering to Lu et al. (2020) glanceable peripheral guidelines.
- [x] **Task 1.7**: Implement `InputLayer.ts` mapping SIK pinch, hover states, and mouse preview emulation.
- [x] **Task 1.8**: Implement `AudioFx.ts` with spatial audio frequency synthesizers for placement and directional alerts.

## Phase 2: Interactive Testing & Verification Framework
- [x] **Task 2.1**: Implement automated Node.js test suite (`tests/loci-lens.test.cjs`) covering all state transitions, Leitner promotions/demotions, and edge cases.
- [x] **Task 2.2**: Implement `LEAFTests.ts` defining Lens Experience Automated Framework test cases.
- [x] **Task 2.3**: Build interactive Web/Canvas SPECS preview simulator (`preview/index.html`, `preview/preview-runner.js`, `preview/styles.css`) faithfully modeling the 37°×32° optical FOV, camera look, WASD room exploration, and click-to-pinch input.
- [x] **Task 2.4**: Run automated test suite to achieve 100% test pass rate.

## Phase 3: Documentation, Video Walkthrough & Submission Kit
- [x] **Task 3.1**: Create `docs/TEST_REPORT.md` documenting comprehensive test results and LEAF scenarios.
- [x] **Task 3.2**: Create `docs/KNOWN_LIMITATIONS.md` distinguishing preview simulation from physical hardware.
- [x] **Task 3.3**: Create `docs/DEMO_INSTRUCTIONS.md` with second-by-second 3-minute video recording script.
- [x] **Task 3.4**: Create `RESEARCH_EVIDENCE.md` and `SOURCE_NOTES.md` documenting cognitive science citations.
- [x] **Task 3.5**: Create companion agent prompts: `CLAD_EXECUTION_PROMPT.md`, `TEST_AND_DEBUG_PROMPT.md`, and `DEMO_AND_SUBMISSION_PROMPT.md`.
- [x] **Task 3.6**: Complete `HANDOFF_CHECKLIST.md` verifying all Devpost requirements.
