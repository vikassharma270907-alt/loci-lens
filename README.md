# TorqueLock AR — Spatial Memory & Procedural Flange Torquing Coach

[![Snap SPECS 27](https://img.shields.io/badge/Platform-Snap%20SPECS%2027%20%2F%20Lens%20Studio%205.23.2-yellow.svg)](https://developers.specs.com/)
[![Devpost Hackathon](https://img.shields.io/badge/Devpost-Learn%20AR%20with%20SPECS-blue.svg)](https://learn-specs.devpost.com/)
[![LEAF Verification](https://img.shields.io/badge/LEAF%20Tests-100%25%20Passing%20(6%2F6)-brightgreen.svg)](docs/TEST_REPORT.md)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **TorqueLock AR** is a spatial learning and procedural training coach for Snap's SPECS smart glasses. It teaches mechanics, pipefitters, and engineering apprentices to remember, recall, and execute a six-bolt star tightening sequence directly on a virtual 1:1 industrial pressure flange.
>
> Grounded in cognitive science, the project integrates the **Method of Loci** with spatial procedural training: **the symmetrical flange itself becomes the memory palace.**

---

## 🚀 Key Highlights & Novelty

1. **Flange as Memory Palace (Method of Loci):** Symmetrical bolt circles disorient technicians. TorqueLock AR binds the cross-pattern tightening sequence directly to physical fastener loci on the flange, combining spatial mnemonic association with hands-free procedural muscle memory.
2. **Dual-Workpiece Fastener Engine:** Unifies two ubiquitous symmetrical mechanical assemblies on a single deterministic state machine:
   - **6-Bolt ASME PCC-1 Pressure Flange:** $1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$ across 35 Nm (Snug), 70 Nm (Intermediate), and 100 Nm (Final Spec).
   - **5-Bolt Automotive Star Lug Hub:** $1 \rightarrow 3 \rightarrow 5 \rightarrow 2 \rightarrow 4$ across 35 Nm (Snug), 75 Nm (Intermediate), and 110 Nm (Final Lock).
3. **Finite Element Gasket Stress Heatmap:** Projects a real-time circumferential stress gradient onto the 3D flange sealing plane. Symmetrical cross-torquing produces an equalized emerald green (`#10B981`) and cyan (`#00F0FF`) distribution; adjacent tightening mistakes immediately trigger localized coral red (`#EF4444`) pinch deflection (+0.24 mm to +1.8 mm) with opposite-side lift-off.
4. **Eyes-Up Continuous Acoustic Pitch Ramp (Blind Wrenching Audio):** Eliminates the need to look at numbers while pulling a two-handed torque wrench. A smooth frequency ramp glides from 440 Hz up to 880 Hz as torque approaches the target, followed by a crisp mechanical ratchet snap click when the pass is locked.
5. **Dynamic Proximity LOD (Henderson & Feiner Phase Shifter):** Automatically transitions from **Macro Navigation** (wide-angle star chords and pass overviews) to **Micro Psychomotor Alignment** (faded secondary lines, circular alignment crosshair, and radial torque progress gauge) as the technician leans within tool reach.
6. **Snap SPECS ASR Voice Commands:** Hands-free speech recognition enables workers wearing greasy gloves to command the glasses: `"Focus Mode"`, `"Next Bolt"`, `"Check Runout"`, `"Proximity LOD"`, and `"Switch Pattern"`.
7. **Zero HUD Clutter & Ergonomic Reach:** Keeps eye level ($y = -4\text{ cm}$ to $+15\text{ cm}$) strictly empty. Interactive controls sit in the ergonomic lower visual field ($y = -28\text{ cm}$, $z = -105\text{ cm}$) to eliminate shoulder fatigue ("gorilla arm").
8. **Decoupled Pure TypeScript Domain Engine & CI Safety:** Zero Lens Studio scene dependencies in domain state machines, verified with 27/27 automated unit & LEAF tests passing and 0 TypeScript diagnostic errors.

---

## 🎮 The Four Experience Stages

```
+---------------------------------------------------------------------------------------+
|                                    TorqueLock AR                                      |
+---------------------------------------------------------------------------------------+
|  [Stage A: LEARN]    --> Associate 6 bolt nodes with spatial mnemonic cues (1->4->2..) |
|  [Stage B: RECALL]   --> Hide sequence; test unassisted retrieval; score Got It/Missed|
|  [Stage C: PRACTISE] --> 3D Flange simulation; active target ring; 3 passes; warp alert|
|  [Stage D: SUMMARY]  --> Accuracy score, missed bolt positions, Leitner review schedule|
+---------------------------------------------------------------------------------------+
```

### Stage A — Learn
- Displays the 1:1 scale six-bolt industrial flange ($42 \times 8 \times 42\text{ cm}$) at workbench depth ($z = -115\text{ cm}$).
- Teaches the criss-cross star sequence: **$1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$**.
- Users associate each spatial node with its procedural role (e.g. Bolt 1: *Initial Anchor*, Bolt 4: *Opposing Cross to equalize centerline load*).

### Stage B — Recall
- Hides the visible sequence numbers.
- Asks: *"Which bolt comes next?"*
- The learner pinches the expected bolt node. Correct answers provide positive confirmation and advance the sequence; incorrect selections explain the mistake and flag the node for targeted review.

### Stage C — Practise
- A glowing cyan `ActiveTargetRing` ($9\text{ cm}$ OD) hugs the active fastener.
- Trainees progress through three progressive torque passes:
  - **Pass 1 (Snug):** $35\text{ Nm}$ ($40\%$ nominal crush)
  - **Pass 2 (Intermediate):** $70\text{ Nm}$ ($70\%$ nominal crush)
  - **Pass 3 (Final Spec):** $100\text{ Nm}$ ($100\%$ uniform seal)
- Trainees toggle **Focus Mode** to collapse detailed tags and test the **Sim Wrong Bolt** fault scenario.

### Stage D — Summary & Spaced Repetition
- Displays overall recall accuracy, correct vs. missed steps, and Leitner 3-box review recommendations.
- Missed bolt positions can be retested immediately.

---

## 📐 Spatial Blueprint & Centimeter Coordinates

Registered within the SPECS 27 optical waveguide frustum ($\pm 16^\circ$ horizontal, $\pm 14^\circ$ vertical safe preview frame, camera origin at $0, 0, 0$):

| Element / Object Name | World Position $(X, Y, Z)\text{ cm}$ | Dimensions $(W \times H \times D)\text{ cm}$ | Additive Color Token | Design / Ergonomic Justification |
|---|---|---|---|---|
| **EyeLevelClearZone** | $(0, 0, -115)$ | $66.0 \times 18.0 \times 1.0$ (Empty) | Transparent | Prevents central line-of-sight occlusion |
| **FlangeWorkbenchAssembly** | $(0, -18, -115)$ | $42.0 \times 8.0 \times 42.0$ | Light Silver-Blue (`#B0C4DE`) | Sits on workbench inside comfortable FOV |
| **BoltNode_1 (12 o'clock)** | $(0, -14, -130.0)$ | $4.5 \times 3.0 \times 4.5$ | Cyan (`#00F0FF`) / Mint (`#4ADE80`) | 1:1 scale M20 hex bolt head; $15\text{ cm}$ radius |
| **BoltNode_2 (2 o'clock)** | $(+13, -14, -122.5)$ | $4.5 \times 3.0 \times 4.5$ | Silver (`#8899AA`) | $60^\circ$ clockwise chord spacing |
| **BoltNode_3 (4 o'clock)** | $(+13, -14, -107.5)$ | $4.5 \times 3.0 \times 4.5$ | Silver (`#8899AA`) | Lower-right quadrant stabilization |
| **BoltNode_4 (6 o'clock)** | $(0, -14, -100.0)$ | $4.5 \times 3.0 \times 4.5$ | Silver (`#8899AA`) | Directly across center from Bolt 1 |
| **BoltNode_5 (8 o'clock)** | $(-13, -14, -107.5)$ | $4.5 \times 3.0 \times 4.5$ | Silver (`#8899AA`) | Counterbalance polar cross |
| **BoltNode_6 (10 o'clock)** | $(-13, -14, -122.5)$ | $4.5 \times 3.0 \times 4.5$ | Silver (`#8899AA`) | Pattern closure and star seal |
| **ActiveTargetRing** | Centered on active bolt | $9.0\text{ cm}$ outer diameter | Cyan (`#00F0FF`) | 1:1 alignment guide on physical bolt |
| **ActiveBoltSpecTag** | $(\text{Bolt\_X}, \text{Bolt\_Y} + 11, \text{Bolt\_Z})$ | $26.0 \times 8.5$ | White (`#FFFFFF`) on translucent | Floats $+11\text{ cm}$ in Y; collapses in Focus Mode |
| **GasketCrushPlane** | $(0, -17, -115)$ | $34.0 \times 1.5 \times 34.0$ | Mint (`#4ADE80`) / Coral (`#FF4D4D`) | Visualizes mechanical gasket stress |
| **PeripheralWarpArrow** | $(+24, -10, -110)$ | $12.0 \times 6.0$ | Amber (`#FACC15`) / Coral (`#FF4D4D`) | Gruenefeld (2017) out-of-view guidance |
| **LowerSimDock (3 Buttons)** | $(-18, 0, +18, -28, -105)$ | $15.0 \times 7.5\text{ cm}$ each | Primary Blue / Cyan (`#00F0FF`) | Lower visual field; outranks prop colliders |

---

## 🔬 Academic Research Grounding

TorqueLock AR translates 14 foundational peer-reviewed papers into concrete SPECS engineering constraints (see [docs/RESEARCH_EVIDENCE.md](docs/RESEARCH_EVIDENCE.md)):

- **Method of Loci & Embodied Spatial Memory:** Krokos et al. (2019) ($8.8\%$ recall gain in immersive HMD) and Moll & Sykes (2023) justify turning the 6 flange bolt positions into physical memory locations.
- **Glanceable AR & Peripheral HUD:** Lu et al. (IEEE VR 2020) and Lu et al. (ACM SUI 2021) mandate keeping eye level clear and accessing status via low-effort peripheral glances.
- **Out-of-View Spatial Guidance:** Gruenefeld et al. (ACM SUI 2017) demonstrated that peripheral directional arrows yield $21.25^\circ$ low error and $84.5\%$ target localization.
- **View Management & Label Separation:** Bell et al. (ACM UIST 2001) and Azuma & Furmanski (ISMAR 2003) establish that only the active target should display an expanded specification tag to prevent clutter and occlusion.
- **Comprehension vs. Psychomotor Phases:** Henderson & Feiner (IEEE TVCG 2011) proved that spatially aligned 3D cues reduce maintenance error by $82\%$, provided visual clutter fades during physical manipulation.
- **Context-Aware Online Adaptation (Focus Mode):** Lindlbauer et al. (ACM UIST 2019) demonstrated that adaptive LOD Knapsack suppression cuts secondary UI interactions by $36\%$ ($p < 0.001$).
- **3D Reach Ergonomics:** Evangelista Belo et al. (ACM CHI 2021) and Fender et al. (ISMAR 2022) establish that tabletop/lower-field interaction ($y = -28\text{ cm}$, $z = -105\text{ cm}$) minimizes RULA arm fatigue.
- **Additive Optical Display Physics:** Kim et al. (ACM SUI 2019) proved that black renders transparent on optical see-through displays, necessitating high-luminance foreground tokens (#FFFFFF, #00F0FF, #4ADE80, #FF4D4D).
- **Multi-Agent XR Synthesis:** De La Torre et al. (ACM CHI 2024, LLMR) showed that a Planner-Builder-Inspector loop cuts code generation errors by $4\times$.

---

## ⚠️ Technical Safety & Validity Rules

1. **Simulation Training Tool Only:** Numeric torque values ($35\text{ Nm}$, $70\text{ Nm}$, $100\text{ Nm}$) and the $1.8\text{ mm}$ gasket deflection formula ($K_{\text{warp}} = 0.0514\text{ mm/Nm}$) are illustrative training dataset parameters.
2. **No Physical Strain Measurement:** The simulation does not measure physical preload, fastener elasticity, or lubrication coefficients.
3. **No Safety Certification:** The software is not certified for pressurized industrial boundary assembly. Real-world procedures must follow manufacturer specifications and **ASME PCC-1** (*Guidelines for Pressure Boundary Bolted Flange Joint Assembly*).
4. **Honest Preview Stand-Ins:** Laptop previews cannot physically connect to a Bluetooth torque wrench; on-screen labels transparently display `"PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH"`.

---

## 🏗️ Repository Architecture

```text
torquelock-ar/
├── TorqueLock.esproj          # Lens Studio 5.23.2 SPECS Project definition
├── LociLens.esproj            # Backwards-compatible Lens project definition
├── .mcp.json                  # Lens Studio MCP Server configuration
├── package.json               # Node.js project configuration & test runner
├── tsconfig.json              # TypeScript compiler settings
├── devpost/
│   └── design-brief.md        # Official Devpost Learn skill-pack brief (status: approved)
├── docs/
│   ├── RESEARCH_EVIDENCE.md   # 14 peer-reviewed citations & design rules
│   ├── TEST_REPORT.md         # Formal acceptance & LEAF test report (100% Pass)
│   ├── KNOWN_LIMITATIONS.md   # Safety disclaimers & preview stand-in notes
│   └── DEMO_INSTRUCTIONS.md   # 2:30 video pitch script & preview checklist
├── Assets/
│   ├── Scripts/
│   │   ├── SequenceEngine.ts  # Decoupled mechanical & star-sequence state machine
│   │   ├── MemoryTrainer.ts   # Method of Loci spatial cues & recall tester
│   │   ├── ReviewStore.ts     # Leitner 3-box spaced repetition engine
│   │   ├── FocusController.ts # Cognitive load & LOD adaptation manager
│   │   ├── FlangeSceneController.ts    # 3D world-anchored flange and bolt nodes
│   │   ├── SIKInteractionController.ts # SIK pinch & UI Kit button event router
│   │   ├── PreviewSimulationController.ts # Honest preview stand-in controller
│   │   └── index.ts           # Root TypeScript export
│   └── Tests/
│       └── TorqueLockScenarios.ts # 6 automated LEAF scenarios (C1 through C6)
├── preview/
│   ├── index.html             # High-fidelity 3D browser SPECS simulator
│   ├── preview-runner.js      # 3D perspective canvas, flange, and interactive test runner
│   └── styles.css             # SPECS additive optical waveguide styling
└── tests/
    ├── torquelock.test.cjs    # Deterministic Node.js unit & integration tests
    └── loci-lens.test.cjs     # Mnemonic model verification tests
```

---

## 🧪 Testing & Verification

### Running Automated Tests
Execute the complete test suite (27 unit and integration tests covering Done Criteria C1 through C6 across both 6-bolt and 5-bolt engines):
```bash
npm test
```

### TypeScript Strict Compilation Check
Verify zero type diagnostic errors across all TypeScript source files:
```bash
npm run typecheck
```

### Required Asset Integrity Check
Verify that all 14 required submission documents, media files, and preview assets exist:
```bash
npm run verify
```

### Running the Interactive Preview Simulator
Launch the local web server to experience the SPECS 27 optical simulation in any browser:
```bash
npm run preview
# Open http://localhost:8080/ in your browser (features both 6-bolt and 5-bolt modes)
```

### Running Automated LEAF Scenarios in Lens Studio
In Lens Studio 5.23.2, open the LEAF panel and run `TorqueLockLeafIndex` to execute:
- `C1_InitialSpatialLayoutScenario`
- `C2_StarSequenceAdvanceScenario`
- `C3_GasketWarpAndRecoveryScenario`
- `C4_FocusModeProgressiveDisclosureScenario`
- `C5_FullStarPassTransitionScenario`
- `C6_ErgonomicReachScenario`

All 6 scenarios execute asynchronously and report **PASSED** in the Logger.

---

## 🎬 Under-3-Minute Video Demo Structure

The video demo strictly follows the 2:30 blueprint outlined in [docs/DEMO_INSTRUCTIONS.md](docs/DEMO_INSTRUCTIONS.md):
- **0:00 – 0:20:** Product introduction & problem statement (symmetrical flange disorientation).
- **0:20 – 0:50:** Stage A: Learn Mode (Method of Loci spatial cues on the 6 bolts).
- **0:50 – 1:20:** Stage B: Recall Mode (hidden sequence retrieval, correct & incorrect feedback).
- **1:20 – 1:55:** Stage C: Practice Mode (star pattern progression, Focus Mode LOD collapse, Sim Wrong Bolt $1.8\text{ mm}$ warp alert and recovery).
- **1:55 – 2:15:** Stage D: Summary (accuracy metrics and Leitner 3-box review recommendations).
- **2:15 – 2:30:** Technical proof (Lens Studio Interactive Preview and LEAF automated test panel showing 6/6 PASSED).

---

## ⚖️ License
MIT License. Built for the **Devpost Learn AR with SPECS Hackathon** sponsored by Snap Inc.
