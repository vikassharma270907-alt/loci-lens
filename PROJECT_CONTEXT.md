# Loci Lens — Project Context

## Project Metadata
- **Project Name:** Loci Lens
- **Target Platform:** Snap SPECS (AR Glasses)
- **Author / Team:** Devpost Learn SPECS Hackathon Team
- **Development Stack:** Lens Studio (v5.22 - v5.24), TypeScript, Spectacles Interaction Kit (SIK), Spectacles UI Kit (SUIK), Lens Studio MCP Server, CLAD (Closed-loop Agentic Development), LEAF Testing Framework.
- **Planning Authority:** `devpost/design-brief.md` (Generated via Devpost Learn SPECS skill pack `plan-lens`).

---

## 1. Executive Summary & Problem Space

Traditional digital learning tools (Anki, Quizlet, mobile flashcards) isolate the human mind from its physical environment. Flashcards present information in 2D lists or floating rectangular viewports, forcing learners into passive rote memorization.

Cognitive science has demonstrated that human spatial memory is exceptionally robust. Ancient Greek and Roman orators leveraged this through the **Method of Loci** ("Memory Palace"), a mnemonic technique wherein items to be remembered are mentally deposited at distinct architectural locations along a known path.

**Loci Lens** directly materializes the Method of Loci in real-world space using **Snap SPECS AR glasses**:
1. It anchors interactive 3D mnemonic cues onto real physical surfaces (tables, doors, shelves).
2. It allows users to physically navigate their space to reinforce spatial memory pathways.
3. It executes active recall tests where cards remain occluded until explicit interaction.
4. It tracks retention using a 3-box Leitner spaced-repetition system.

---

## 2. Product Architecture & User Journey

### A. Onboard Phase
- Single, high-legibility instruction card anchored 1.1 m ahead.
- Briefs user on looking around, placing cards, and recalling answers.
- User pinches "Begin" to transition into Place mode.

### B. Place Phase
- The user is presented with a 6-card demo deck.
- Active card icon floats at gaze point, constrained to comfortable depths (0.8 m to 2.0 m).
- Aiming at a surface and performing an SIK pinch pins the card to that 3D world locus.
- Visual confirmation: locus marker pulses with a soft spatial audio chime (`AudioFx.playPlaceTone()`).
- The **Peripheral HUD** updates its ring counter (e.g. 1/6, 2/6, ..., 6/6).
- Once 6 cards are anchored, transitions to Stroll or Test mode.

### C. Stroll Phase
- Non-distracting exploration mode.
- Each locus displays its minimalist mnemonic icon.
- Looking directly at a locus highlights it; stepping within 1.5 m reveals the key concept.
- A subtle directional arrow points to the next sequential locus if it leaves the user's field of view.

### D. Test Phase (Active Recall)
- All locus answer plates are fully hidden.
- The user navigates to a locus and reads the question prompt.
- The user attempts mental recall.
- An explicit SIK pinch triggers an animated card flip, revealing the answer.
- Two large SIK buttons appear: **"Got It"** (green glow) and **"Missed"** (amber glow).
- Selecting Got It increments Leitner confidence (Box 1 → Box 2 → Box 3).
- Selecting Missed flags the card for targeted re-testing and schedules immediate review.

### E. Summary Phase
- Displays session performance: Total Reviewed, Remembered, Missed, and Accuracy Percentage.
- Leitner box distribution (Mastered, Learning, Needs Review).
- Interactive SIK buttons: "Retest Missed Cards" or "Reset Memory Palace".

---

## 3. Technology Integration Details

### Spectacles Interaction Kit (SIK)
- Provides canonical hand tracking and gaze-cursor raycasting.
- Standardizes the **pinch** gesture across physical glasses and Interactive Preview (where mouse click simulates pinch).
- Guarantees accessibility and eliminates awkward custom gesture detection.

### Spectacles UI Kit (SUIK)
- Employs standardized **BackPlate** components with dark translucent materials, ensuring high typographic contrast on additive see-through displays (where black = transparent).
- Large interaction targets (min. 12 cm x 5 cm at 1.1 m distance) to prevent targeting frustration.

### Lens Studio MCP Server & CLAD
- Lens Studio provides a Model Context Protocol server allowing AI agents to query the scene graph, manipulate SceneObjects, attach TypeScript components, and inspect runtime logs.
- CLAD provides closed-loop agentic loops that execute automated LEAF test scenarios to verify scene state.

---

## 4. Hardware vs. Preview Simulation Matrix

| Feature | Physical SPECS Glasses | Lens Studio Interactive Preview |
|---|---|---|
| Display | Additive waveguide FOV (37° vertical × 32° horizontal) | Simulated FOV boundary mask with additive color rendering |
| Input | Real-time dual hand-tracking Pinch / Grab | Mouse cursor click simulating primary hand pinch |
| Navigation | Physical head 6DoF tracking & room walking | Keyboard (WASD, Q/E) + Mouse look |
| Spatial Meshing | Real-time LiDAR / stereo camera mesh reconstruction | Simulated room mesh & virtual collision plane stand-in |
| Persistence | Session spatial coordinate anchor | Session-based virtual world coordinate transform |

---

## 5. Hackathon Deliverables Summary
1. `devpost/design-brief.md`: Completed design contract generated by the Devpost Learn skill pack.
2. Lens Studio Project (`LociLens.esproj`, `Scripts/`, `Assets/`): Functional AR experience.
3. Automated Tests (`tests/loci-lens.test.cjs`, `Scripts/LEAFTests.ts`): Rigorous unit & integration tests.
4. Interactive Preview (`preview/index.html`): High-fidelity browser simulator of SPECS FOV.
5. Demonstration Video & Documentation: Structured YouTube demo outline and complete developer handoff.
