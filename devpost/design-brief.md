---
status: approved
platform: SPECS 27 (Lens Studio 5.23.2 Interactive Preview)
project: TorqueLock AR — Spatial Memory & Procedural Flange Torquing Coach
---

# Design Brief: TorqueLock AR — Spatial Star-Pattern Torque & Gasket Coach

<!-- Generated via the Devpost Learn SPECS Skill Pack (plan-lens). Approved for CLAD & LEAF automated implementation. -->

## 1. Problem & Target Audience

- **Who it is for:** Mechanical engineering students, industrial pipefitting apprentices, automotive and aviation technicians, and learners mastering multi-bolt pressure-flange assembly procedures.
- **Why AR glasses instead of a phone or laptop:**
  - Tightening a high-torque pressure boundary flange requires both hands physically gripping a heavy torque wrench while maintaining continuous optical gaze on the workpiece.
  - Symmetrical bolt circles create severe spatial disorientation: checking a 2D paper chart or smartphone screen forces constant context switching, resulting in skipped bolts, double-torqued studs, or uneven gasket crush (flange warping).
  - TorqueLock AR grounds the procedure in the physical world: the glasses look down at the flange, project the tightening sequence directly onto the physical fasteners at 1:1 scale, and dynamically collapse secondary instructions as soon as the mechanic engages the tool.
- **The Single Core Spatial Moment:**
  - Standing over a 1:1 scale six-bolt industrial flange at workbench depth ($z = -115\text{ cm}$, $y = -18\text{ cm}$), watching a cyan glowing star-pattern ring jump directly across the center of the flange from Bolt 1 (12 o'clock) to Bolt 4 (6 o'clock), seeing the floating 2-line specification tag collapse into a minimal 1-line eyes-up status ring during wrench engagement, and catching an out-of-sequence gasket-warp hazard before the joint is compromised.

---

## 2. Spatial Layout & Centimeter Coordinates (Camera Origin at 0, 0, 0)

All virtual elements are registered in real-world centimeter coordinates within the Snap SPECS 27 optical waveguide frustum ($\pm 16^\circ$ horizontal, $\pm 14^\circ$ vertical safe preview frame):

1. **Eye-Level Clear Zone ($y = -4\text{ cm}$ to $+15\text{ cm}$, $z = -115\text{ cm}$):**
   - Strictly empty. Zero floating HUDs, head-locked scoreboards, or persistent timers occluding central forward vision.
2. **Flange Workbench Assembly ($x = 0$, $y = -18\text{ cm}$, $z = -115\text{ cm}$):**
   - 1:1 scale circular industrial pressure flange ($42 \times 8 \times 42\text{ cm}$ base, $30\text{ cm}$ bolt circle diameter) with intermediate gasket layer (`GasketCrushPlane` at $y = -17\text{ cm}$).
3. **Six Hex Bolt Nodes (`BoltNode_1` through `BoltNode_6`):**
   - Arranged clockwise at 60-degree intervals on a $15\text{ cm}$ radius ($30\text{ cm}$ circle) around $(0, -14, -115)\text{ cm}$:
     - **BoltNode_1** (12 o'clock / Top): $(0, -14, -130.0)\text{ cm}$
     - **BoltNode_2** (2 o'clock / Upper Right): $(+13, -14, -122.5)\text{ cm}$
     - **BoltNode_3** (4 o'clock / Lower Right): $(+13, -14, -107.5)\text{ cm}$
     - **BoltNode_4** (6 o'clock / Bottom): $(0, -14, -100.0)\text{ cm}$
     - **BoltNode_5** (8 o'clock / Lower Left): $(-13, -14, -107.5)\text{ cm}$
     - **BoltNode_6** (10 o'clock / Upper Left): $(-13, -14, -122.5)\text{ cm}$
4. **Star Sequence Order:**
   - Demonstrates the standard criss-cross pattern: **$1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$** across 3 progressive training passes:
     - **Pass 1 (Snug):** $35\text{ Nm}$ ($40\%$ nominal crush)
     - **Pass 2 (Intermediate):** $70\text{ Nm}$ ($70\%$ nominal crush)
     - **Pass 3 (Final Spec):** $100\text{ Nm}$ ($100\%$ uniform seal)
5. **Active Bolt Ring & Spec Tag:**
   - `ActiveTargetRing`: $9.0\text{ cm}$ outer diameter glowing cyan ring hugging the active bolt head.
   - `ActiveBoltSpecTag`: $26.0 \times 8.5\text{ cm}$ floating tag positioned $11\text{ cm}$ above active bolt at $(\text{Bolt\_X}, \text{Bolt\_Y} + 11, \text{Bolt\_Z})$. Max 2 lines of text. Collapses to compact 1-line pill in Focus Mode.
6. **Lower-Field Preview Sim Dock ($z = -105\text{ cm}$, $y = -28\text{ cm}$):**
   - Three large Spectacles UI Kit Primary buttons ($15.0 \times 7.5\text{ cm}$ each with $3\text{ cm}$ spacing), outranking 3D prop colliders:
     - `BtnApplyTorque` at $(-18, -28, -105)$: "Apply Torque" (advances active bolt through Wrench Engaged $\rightarrow$ Target Reached $\rightarrow$ Next Star Bolt).
     - `BtnSimError` at $(0, -28, -105)$: "Sim Wrong Bolt" (simulates torquing an adjacent out-of-sequence bolt, triggering a $+1.8\text{ mm}$ gasket warp alert).
     - `BtnFocusMode` at $(+18, -28, -105)$: "Focus Mode" (toggles cognitive Level-of-Detail reduction between 2-line tag and 1-line eyes-up pill).
7. **Direct Pinch Interaction:**
   - Pinching any `BoltNode_i` directly in 3D space triggers torque on that specific bolt. Correct sequence bolts advance; incorrect bolts trigger sequence mismatch alerts.

---

## 3. Method of Loci Integration (Spatial Memory Palace)

TorqueLock AR synthesizes spatial procedural training with the **Method of Loci** mnemonic:
- **Flange as Memory Palace:** The six bolt positions serve as the 6 spatial memory locations.
- **Learn Phase:** Introduces the star sequence by associating memorable spatial cues with each position:
  - *Bolt 1 (12 o'clock):* "Initial Anchor — Top Origin"
  - *Bolt 4 (6 o'clock):* "Opposing Cross — Direct Polar Balance"
  - *Bolt 2 (2 o'clock):* "Next Pair Shift — Upper Right Companion"
  - *Bolt 5 (8 o'clock):* "Second Polar Cross — Lower Left Counterbalance"
  - *Bolt 3 (4 o'clock):* "Final Pair Entry — Lower Right Wing"
  - *Bolt 6 (10 o'clock):* "Pattern Closure — Upper Left Finish"
- **Recall Phase:** Hides all visible sequence numbers. Prompts: *"Which bolt comes next?"* The user must recall the next position from memory and pinch the correct bolt node.
- **Practise Phase:** 3D interactive flange practice simulation with live target ring, error simulation, and multi-pass torque targets.
- **Summary & Review Phase:** Displays total recall steps, correct vs. missed steps, sequence accuracy percentage, and Leitner 3-box review recommendations.

---

## 4. Honest Preview Sensor Stand-Ins

- **Simulation Transparency:** Because Lens Studio's laptop preview cannot connect to a physical Bluetooth digital torque wrench or optical strain gauge, `BtnApplyTorque`, `BtnSimError`, and 3D direct pinch interactions stand in for physical wrench engagement.
- **On-Screen Disclaimers:**
  - `PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH`
  - `SIMULATION MODE — NO REAL TORQUE MEASUREMENT`
- **Real Math & State Machine:** Star-pattern sequence logic, multi-pass progression ($35 \rightarrow 70 \rightarrow 100\text{ Nm}$), gasket imbalance deflection calculations, and cognitive LOD state machines are $100\%$ real TypeScript code (`Assets/Scripts/SequenceEngine.ts`).

---

## 5. Five Testable Done Criteria (Verified via LEAF Scenarios)

1. **C1 (Initial Spatial Layout & Star Target #1):**
   - On scene start, `FlangeWorkbenchAssembly` is anchored at $(0, -18, -115)\text{ cm}$, eye-level zone $(0, 0, -115)\text{ cm}$ has zero UI objects, `ActiveTargetRing` is anchored on `BoltNode_1` at $(0, -14, -130)\text{ cm}$, and `ActiveBoltSpecTag` reads `"BOLT 1 OF 6 · PASS 1\nTARGET: 35 Nm SNUG"`.
2. **C2 (Comprehension-to-Psychomotor LOD Transition & Star Advance):**
   - Triggering `BtnApplyTorque` (or pinching `BoltNode_1`) engages psychomotor mode (collapsing tag into `"35 Nm LOCK ✓"`), marks `BoltNode_1` with green pass badge, and moves `ActiveTargetRing` across the flange center to `BoltNode_4` at $(0, -14, -100)\text{ cm}$ (`"BOLT 2 OF 6 · PASS 1\nTARGET: 35 Nm SNUG"`).
3. **C3 (Out-of-Sequence Gasket Warp Alert & Recovery):**
   - Triggering `BtnSimError` (or pinching out-of-sequence `BoltNode_2` while `BoltNode_4` is active) calculates a $+1.8\text{ mm}$ gasket warp deflection, turns `GasketCrushPlane` coral red, and displays `PeripheralWarpArrow` reading `"!! SEQUENCE ERROR: UNDO BOLT 2 (-35 Nm) !!"`. Triggering `BtnApplyTorque` relieves `BoltNode_2` and restores nominal alignment.
4. **C4 (Focus Mode Progressive Disclosure):**
   - Triggering `BtnFocusMode` collapses `ActiveBoltSpecTag` into a compact 1-line pill (`"P1 · B1 · 35 Nm"`) while keeping the 1:1 `ActiveTargetRing` visible on the bolt head; triggering `BtnFocusMode` again restores the 2-line comprehension tag.
5. **C5 (Full Pass Completion & Seal Summary):**
   - Advancing through all 6 bolts in star order ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$) completes Pass 1 ($35\text{ Nm}$ uniform crush, $0.0\text{ mm}$ warp), transitions cleanly to Pass 2 ($70\text{ Nm}$ target on `BoltNode_1`), and after Pass 3 displays the completion banner `"FLANGE SEALED · 100 Nm · 0.0 mm WARP"`.
6. **C6 (Ergonomic Arm Reachability):**
   - Verified via LEAF `IkBodyInteractor` that lower-field dock buttons ($z = -105\text{ cm}$, $y = -28\text{ cm}$) are comfortably within reachable human arm biomechanics without inducing shoulder elevation fatigue (Evangelista Belo et al., CHI 2021).

---

## 6. Technical Safety & Industrial Validity Rules

1. **Educational Simulation Only:** All numeric torque values ($35\text{ Nm}$, $70\text{ Nm}$, $100\text{ Nm}$) and the $1.8\text{ mm}$ gasket warp calculation are illustrative demo training data only.
2. **No Real Strain Modeling:** The engine does not model non-linear material stress, fastener friction coefficients, gasket creep, or actual strain measurements.
3. **No Safety Certification:** The application is not certified for high-pressure industrial, chemical, or aviation installations. Real-world procedures must strictly follow manufacturer specifications and **ASME PCC-1** (*Guidelines for Pressure Boundary Bolted Flange Joint Assembly*).

---

## 7. HCI Research Foundation & Citations

1. **Lindlbauer, Feit, & Hilliges (ACM UIST 2019):** Context-Aware Online Adaptation of Mixed Reality Interfaces. *Design Implication:* Cognitive load reduction via 2-tier LOD state machine (Focus Mode).
2. **Henderson & Feiner (IEEE TVCG 2011):** Exploring the Benefits of AR Documentation for Maintenance and Repair. *Design Implication:* Separation of Comprehension (orienting beacon) and Psychomotor (unobstructed progress ring) phases.
3. **Bell, Feiner, & Höllerer (ACM UIST 2001) / Azuma & Furmanski (ISMAR 2003):** View Management & Label Placement. *Design Implication:* Single expanded active label, compact $+11\text{ cm}$ offset badges to prevent occlusion.
4. **Evangelista Belo et al. (ACM CHI 2021) / Fender et al. (ISMAR 2022):** XRgonomics & ComforTable UIs. *Design Implication:* Eye level ($y = 0$) kept completely clear; interactive dock placed in lower visual field ($y = -28\text{ cm}$, $z = -105\text{ cm}$).
5. **Gruenefeld et al. (ACM SUI 2017):** EyeSee360. *Design Implication:* Workspace constrained to forward hemisphere; high-contrast peripheral arrow for off-axis hazards.
6. **Kim et al. (ACM SUI 2019):** Additive Optical See-Through Display Acuity. *Design Implication:* High-luminance foreground colors (#FFFFFF, #00F0FF, #4ADE80, #FF4D4D) on translucent backplates; no black text.
7. **Krokos, Plaisant, & Varshney (Virtual Reality 2019) / Moll & Sykes (2023):** Method of Loci in Immersive Spatial Environments. *Design Implication:* 6 bolt nodes serve as physical loci for sequence recall.
8. **De La Torre et al. (ACM CHI 2024):** LLMR: Closed-Loop Multi-Agent XR Synthesis. *Design Implication:* Decoupled pure-TypeScript domain engine with automated LEAF verification.
