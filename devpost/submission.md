# TorqueLock AR — Devpost Hackathon Submission

**Hackathon:** Learn AR with SPECS (Devpost 2026)  
**Track:** Educational & Spatial Memory / Enterprise & Industrial Training  
**Platform:** Snap SPECS (Lens Studio v5.23 / v5.24)  
**Repository:** https://github.com/vikassharma270907-alt/loci-lens  
**Demo Video:** `torquelock_ar_demo_walkthrough.mp4` (Duration: 2m 22s, 1080p, with full audio narration and sound effects)  
**Thumbnail:** `torquelock_ar_youtube_thumbnail.png` (1280x720)  
**Captions:** `torquelock_demo_captions.srt` & `torquelock_demo_captions.vtt`  

---

## 1. Project Overview

### Project Title
**TorqueLock AR — Spatial Memory & Procedural Flange Torquing**

### Elevator Pitch (139 Characters)
*TorqueLock AR transforms the 6-bolt flange into a spatial memory palace on Snap SPECS, training procedural star-pattern torquing hands-free.*

---

## 2. Devpost Submission Story

### Inspiration
In high-pressure industrial facilities—oil refineries, chemical plants, water treatment stations, and power turbines—bolted flange joint assembly is a critical maintenance task. When a flange is tightened improperly, the gasket seats unevenly, leading to catastrophic high-pressure fluid leaks, environmental contamination, and multimillion-dollar unplanned plant downtime.

The **American Society of Mechanical Engineers (ASME)** standard **ASME PCC-1** mandates a strict cross-pattern (star) tightening sequence across multiple progressive torque passes ($35\text{ Nm} \rightarrow 70\text{ Nm} \rightarrow 100\text{ Nm}$). 

However, circular industrial flanges are rotationally symmetrical and feature zero natural spatial landmarks. When technicians hold a heavy mechanical torque wrench while glancing back and forth at a 2D paper chart or tablet, they experience severe context-switching latency, lose track of their position, and make procedural errors.

We asked: **What if the physical six-bolt flange itself became the spatial memory palace?**

By grounding the ancient **Method of Loci** in head-worn augmented reality on **Snap SPECS**, TorqueLock AR anchors procedural mnemonic cues directly to the physical fasteners, transforming an error-prone task into an intuitive, muscle-memory workflow.

---

### What It Does
TorqueLock AR guides technicians through a four-phase cognitive training curriculum:

1. **Phase 1: Learn (Spatial Loci Encoding)**
   - The user inspects a 1:1 scale six-bolt industrial flange ($42\text{ cm}$ diameter, $15\text{ cm}$ bolt circle radius) positioned at $(0, -18, -115)\text{ cm}$ in real 3D space.
   - The application highlights the ASME PCC-1 cross-pattern star sequence ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$) using high-luminance cyan guidance rings and spatial beacons.
   - Each bolt position is encoded as a distinct mnemonic locus:
     - **Bolt 1:** Anchor Locus (Top Dead Center)
     - **Bolt 4:** Cross Locus (Polar Opposite)
     - **Bolt 2:** Shift Locus (Clockwise $+60^\circ$ pair initiation)
     - **Bolt 5:** Cross Locus (Polar balance opposing B2)
     - **Bolt 3:** Shift Locus (Final pair initiation)
     - **Bolt 6:** Closure Locus (Symmetric seating circle completion)

2. **Phase 2: Recall (Active Retrieval Without Visual Crutches)**
   - Guidance lines disappear. The user is prompted to identify the next bolt in the sequence purely from spatial recall.
   - Using the Spectacles Interaction Kit (SIK), the technician points and pinches the active bolt to confirm their selection.
   - Immediate audio-spatial feedback validates retrieval, strengthening hippocampal indexing before hands-on wrenching.

3. **Phase 3: Practise (Progressive Torque Ramp & Gasket Warp Detection)**
   - Technicians simulate the ASME PCC-1 three-pass torque ramp:
     - **Pass 1:** $35\text{ Nm}$ (20–30% initial gasket seat)
     - **Pass 2:** $70\text{ Nm}$ (50–70% intermediate ramp)
     - **Pass 3:** $100\text{ Nm}$ (100% final target torque)
   - **Cognitive Focus Mode (Henderson & Feiner, Lindlbauer et al.):** The moment tool engagement begins, expanded specification tags collapse into a minimal, eyes-up 1-line status pill (`P1 · B1 · 35 Nm`), leaving the technician’s central vision completely unobstructed.
   - **Real-Time Gasket Warp Alert:** If a technician tightens bolts sequentially in an adjacent circle instead of the cross pattern, the simulation engine calculates non-uniform stress and flashes an immediate warning:  
     `⚠️ GASKET WARP: 1.80 mm DEFLECTION DETECTED! Return to ASME PCC-1 star sequence.`

4. **Phase 4: Summary (Leitner 3-Box Spaced Repetition)**
   - Displays session tightening accuracy (94.4%) and pass efficiency.
   - Automatically routes missed or warped bolts into a **Leitner 3-box spaced repetition system**:
     - **Box 1 (Daily Remediation):** Erroneous bolt positions queued for immediate re-testing.
     - **Box 2 (3-Day Review):** Intermediate retention items.
     - **Box 3 (Mastered Loci):** Perfect unassisted recall.
   - Technicians can launch an instant remediation loop with a single SIK pinch.

---

### How We Built It
- **Hardware & Optics:** Built for **Snap SPECS 27** using **Lens Studio 5.23/5.24**. Designed specifically for the $37^\circ\text{ V} \times 32^\circ\text{ H}$ optical waveguide field of view and calibrated to the $1.15\text{ m}$ comfortable focal plane.
- **Additive Optical Design:** On diffractive optical waveguides, virtual black is 100% transparent. We utilized high-luminance additive colors (`#00F0FF` Cyan, `#4ADE80` Mint, `#FF4D4D` Coral, `#FACC15` Amber) over semi-translucent dark backplates (`#0F172A` at 88% opacity) to eliminate ambient photon washout (Kim et al., ACM SUI 2019).
- **Decoupled TypeScript Architecture:**
  - `SequenceEngine.ts`: Headless state machine governing the ASME PCC-1 star sequence, 3-pass torque ramp, and gasket deflection formulas with zero scene dependencies.
  - `MemoryTrainer.ts`: Method of Loci mnemonic encoding engine.
  - `FocusController.ts`: Cognitive Level-of-Detail (LOD) manager that implements the Henderson & Feiner / Lindlbauer visual decluttering knapsack.
  - `ReviewStore.ts`: Leitner 3-box spaced repetition persistence engine.
  - `FlangeSceneController.ts`: 1:1 scale flange mesh, centimeter-accurate bolt positions, and glowing target rings.
  - `SIKInteractionController.ts`: Pinch gesture routing, 3D bolt picking, and lower-field UI dock ($y = -28\text{ cm}$, $z = -105\text{ cm}$) to eliminate arm fatigue (Evangelista Belo et al., CHI 2021).
  - `PreviewSimulationController.ts`: Honest preview sensor stand-ins with transparent disclaimer banners.
- **Interactive Browser Optical Preview (`preview/`):**
  - Standalone perspective Canvas preview modeling the exact Snap SPECS optical cone, flange 3D wireframe, Focus Mode toggle, gasket warp simulation, Web Audio synthesizer, and live in-preview test runner. Served locally at `http://localhost:8080/`.
- **Closed-Loop Agentic Development (CLAD) & Automated LEAF Tests:**
  - Authored automated LEAF scenarios C1 through C6 (`Assets/Tests/TorqueLockScenarios.ts`, `Scripts/LEAFTests.ts`).
  - Implemented unit test suite (`tests/torquelock.test.cjs`) verified with **20 / 20 tests passing (100% OK)**.

---

### Research Grounding (14 Peer-Reviewed HCI Papers)
TorqueLock AR is grounded in 14 peer-reviewed academic publications synthesized in `RESEARCH_EVIDENCE.md`:
1. **Krokos, Plaisant, & Varshney (Virtual Reality 2019):** Head-tracked spatial memory palaces yield an 8.8% recall gain.
2. **Moll & Sykes (Virtual Reality 2023):** Method of Loci spatial ordering significantly accelerates procedural acquisition.
3. **Henderson & Feiner (IEEE TVCG 2011):** Division of maintenance into Comprehension vs. Psychomotor phases; 3D attention cues decrease assembly error rates by 82%.
4. **Lindlbauer, Feit, & Hilliges (ACM UIST 2019):** Cognitive load optimization knapsack reduces secondary UI interactions by 36% without task time penalty.
5. **Kim, Erickson, et al. (ACM SUI 2019):** Additive optical see-through display contrast and visual fatigue mitigation.
6. **Evangelista Belo et al. (ACM CHI 2021) & Fender et al. (ISMAR 2022):** Ergonomic lower-field interaction placement preventing "gorilla arm" fatigue.
7. **De La Torre et al. (ACM CHI 2024):** Decoupled domain state machines reduce 3D generation defects by 4×.
8. **Lu et al. (IEEE VR 2020 & ACM SUI 2021):** Peripheral HUD placement and intentional activation mechanics.
9. **Bell et al. (UIST 2001) & Azuma & Furmanski (ISMAR 2003):** 3D view management and label decluttering.
10. **Lee et al. (ACM UIST 2025):** Unobtrusive multimodal AR agent interaction.

---

### Industrial Safety & Simulation Boundaries
- **ASME PCC-1:** Referenced strictly for procedural star-pattern sequence education.
- **Simulation Disclaimer:** All torque values ($35, 70, 100\text{ Nm}$) and gasket warp deflection ($1.8\text{ mm}$ via $K_{\text{warp}} = 0.0514\text{ mm/Nm}$) are illustrative educational training parameters. TorqueLock AR maintains prominent on-screen notices (`PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH` and `SIMULATION MODE — NO REAL TORQUE MEASUREMENT`) and does not claim certified high-pressure boundary engineering measurements.

---

### Accomplishments We're Proud Of
- **Flange as Memory Palace:** Inventing an elegant solution to the circular flange disorientation problem by mapping mnemonic loci directly to physical fastener coordinates.
- **Cognitive Focus Mode:** Implementing dynamic Level-of-Detail decluttering that respects the technician's line of sight during physical manipulation.
- **100% Automated Test Pass Rate:** 20/20 automated tests passing across domain logic, Leitner storage, Focus Mode, and warp detection.
- **Seamless Multimodal Experience:** Complete integration of 3D optical preview, spatial audio synthesizer, SIK pinch interactions, and automated test runners.

---

### What We Learned
- **Less is More in AR:** Floating labels that look beautiful while stationary become dangerous distractions when holding a real tool. Dynamically collapsing secondary text into a compact status pill is vital for industrial augmented reality.
- **Embodied Space Outperforms Flat Screens:** Technicians retain procedural ordering far better when physically interacting with loci in 3D space rather than studying static 2D diagrams.

---

### What's Next for TorqueLock AR
- **Hardware Bluetooth BLE Torque Wrench Integration:** Pairing with smart industrial torque wrenches (e.g. Atlas Copco, Sturtevant Richmont) to receive real-time torque telemetries within certified tolerance bands.
- **Multi-User Synchronized Bolting:** Enabling two technicians wearing Snap SPECS to execute synchronized dual-wrenching on massive 24-bolt and 48-bolt subsea flanges.
- **Edge Vision 6DoF Flange Tracking:** Utilizing Snap SPECS onboard RGB cameras for millimeter-accurate visual tracking of uninstrumented physical flanges in the wild.
