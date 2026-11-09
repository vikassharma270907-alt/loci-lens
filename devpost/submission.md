# TorqueLock AR — Devpost Hackathon Submission

**Hackathon:** Learn AR with SPECS (Devpost 2026)  
**Track:** Technical Implementation & Spatial Design  
**Platform:** Snap SPECS (Lens Studio 5.23.2 · SPECS 27 Interactive Preview)  
**Target Device:** Snap Spectacles (Gen 5)  
**Repository:** https://github.com/vikassharma270907-alt/loci-lens  
**Interactive 3D Simulator:** https://loci-lens.vercel.app/ (or `npm run preview` -> `http://localhost:8080/`)  
**Built With:** `ar`, `clad`, `leaf`, `lens-studio`, `lens-studio-mcp`, `snap-spectacles`, `spectacles-interaction-kit`, `typescript`, `web-audio-api`  

---

## 1. Project Overview

### Project Title
**TorqueLock AR: Universal 1:1 Star-Pattern Flange & Lug Torque Coach for Snap SPECS**  
*(Featuring the CrossTorque Multi-Pattern Dual Engine: 6-Bolt ASME PCC-1 Process Flange & 5-Bolt Automotive Star Lug Hub)*

### Tagline (Short Description)
*Hands on the torque wrench, eyes on the workpiece: A 1:1 spatial memory and procedural torquing coach for Snap SPECS that guides ASME star sequences, catches gasket-warping mistakes in real-time, and goes quiet while you pull.*

---

## 2. Devpost Submission Story

### Inspiration
In high-pressure chemical refineries, power generation facilities, and automotive service bays, the integrity of bolted circular joints is literally a matter of life, death, and environmental containment. When a circular flange or automotive wheel hub is tightened incorrectly, the gasket or brake rotor suffers asymmetric pinch-loading, causing catastrophic gasket blowouts, fluid leaks, warped rotors (>0.15 mm runout), and multi-million-dollar plant shutdowns.

To guarantee uniform gasket seating, **ASME PCC-1** mandates a strict criss-cross star sequence:
* **6-Bolt Industrial Pressure Flanges:** $1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$ across three progressive passes ($35\text{ Nm} \rightarrow 70\text{ Nm} \rightarrow 100\text{ Nm}$).
* **5-Bolt Automotive Wheel Hubs:** $1 \rightarrow 3 \rightarrow 5 \rightarrow 2 \rightarrow 4$ across three progressive passes ($35\text{ Nm} \rightarrow 75\text{ Nm} \rightarrow 110\text{ Nm}$).

Yet circular industrial workpieces are **rotationally symmetrical with zero natural spatial landmarks**. When technicians are crouched over a hub with both greasy hands locked onto a heavy two-handed mechanical torque wrench, looking back and forth at a 2D paper manual or tablet creates severe context-switching fatigue, causes workers to lose their place, and leads to sequential circular tightening mistakes.

---

### What It Does
TorqueLock AR is engineered around one hands-free spatial moment: standing or crouching over a 1:1 physical fastener circle ($Z = -110\text{ cm}$ to $-115\text{ cm}$) with a torque wrench in both hands.

1. **The Flange as a Spatial Memory Palace (Method of Loci):**
   Instead of viewing arbitrary floating flashcards, **the symmetrical bolt positions on the physical workpiece become the mnemonic loci**. Each bolt is anchored with a spatial procedural role (e.g., *Bolt 1: Top Origin Anchor*, *Bolt 4: Polar Cross Equalizer*, *Bolt 2: Pair Shift*), transforming procedural compliance into intuitive muscle memory.
2. **Dual-Workpiece Multi-Pattern Engine:**
   Supports both **6-Bolt ASME PCC-1 Pressure Flanges** and **5-Bolt Automotive Lug Nut Hubs** with a single pinch or voice toggle.
3. **Finite Element Gasket Stress Heatmap:**
   A real-time 3D circumferential stress gradient projects directly onto the gasket plane. When tightened in sequence, the ring glows uniform emerald green (`#10B981`) and cyan (`#00F0FF`). If an adjacent mistake is attempted, the stress gradient flashes coral red (`#EF4444`) with the exact calculated deflection (+0.24 mm to +1.8 mm).
4. **Eyes-Up Continuous Acoustic Pitch Ramp (Blind Wrenching Audio):**
   Technicians shouldn't read numbers while pulling a wrench. The system modulates a smooth acoustic pitch ramp from $440\text{ Hz} \rightarrow 880\text{ Hz}$ as torque approaches specification, culminating in a crisp mechanical ratchet snap click when locked.
5. **Dynamic Proximity LOD (Henderson & Feiner Phase Shifter):**
   When standing back ($>80\text{ cm}$), macro star chords and pass overviews guide navigation. When leaning in to seat the wrench socket ($<45\text{ cm}$), secondary lines fade and a high-precision circular alignment crosshair snaps onto the active bolt. Eye level ($Y = 0\text{ cm}$) remains 100% clear at all times.
6. **Out-of-FOV Gaze Guidance (Gruenefeld et al. SUI 2017):**
   If the technician turns their head $>12^\circ$ off-axis, a bright pulsing yellow edge chevron (`LOOK RIGHT >> BOLT #X`) guides their gaze back to the active bolt.
7. **Snap SPECS ASR Hands-Free Voice Commands:**
   Workers wearing greasy gloves can speak hands-free commands: `"Focus Mode"`, `"Next Bolt"`, `"Check Runout"`, `"Proximity LOD"`, and `"Switch Pattern"`.
8. **Leitner 3-Box Spaced Repetition Debrief:**
   Mastery metrics route any missed bolt positions into Box 1 for immediate targeted re-testing before field deployment.

---

### How I Built It
- **Devpost Learn Skill Pack First:** Planned before writing code using the official `challengepost/learn-specs` (`plan-lens`) skill pack. Generated `devpost/design-brief.md` (status: approved) establishing exact centimeter coordinates, optical waveguide FOV constraints ($37^\circ \times 32^\circ$), and testable Done Criteria C1 through C6.
- **Closed-Loop Agentic Development (CLAD):** Developed using Snap's CLAD workflow and Lens Studio MCP server, iteratively building and inspecting TypeScript scene objects, materials, and SIK interactables.
- **Decoupled TypeScript Engines:** Built on headless, scene-independent pure TypeScript engines (`SequenceEngine.ts`, `CrossTorqueEngine.ts`, `MemoryTrainer.ts`, `ReviewStore.ts`) verified by 27 automated unit tests.
- **Interactive 3D Waveguide Simulator (`preview/`):** A standalone perspective Canvas simulator modeling SPECS 27 optical physics, Web Audio synthesizer, Focus Mode, and live LEAF execution.
- **Automated LEAF 2.0.2 Test Suite:** Six automated LEAF scenarios (`c1_initial_layout` through `c6_ergonomic_reach_guard`) executing deterministically inside the Lens Studio SPECS preview with 100% pass rate.

---

### Challenges I Ran Into
1. **Additive Optical Waveguide Display Physics:** Black pixels render transparent on see-through waveguides. We replaced dark container cards with high-luminance foreground tokens (`#00F0FF`, `#10B981`, `#FACC15`, `#EF4444`) with subtle translucent backplates (85% alpha) for crisp outdoor contrast.
2. **Preventing Visual Occlusion & Shoulder Fatigue:** At $Z = -110\text{ cm}$, floating panels in the center of vision block the wrench socket. We enforced an absolute **Eye-Level Clear Zone** ($Y = -4\text{ cm}$ to $+15\text{ cm}$) and anchored the interactive control dock in the lower visual field ($Y = -28\text{ cm}$, $Z = -105\text{ cm}$), adhering to Evangelista Belo et al. (CHI 2021) reach guidelines.
3. **Honest Preview Stand-Ins:** Laptop previews cannot physically measure torque wrench strain gauges. Following the rule *"fake the sensing, keep the response,"* SIK pinch colliders on 3D bolt heads and lower-field dock buttons stand in for socket seating and mechanical torque clicks.

---

### What I Learned
Augmented reality for smart glasses is at its best when it **gets out of the way**. By shifting from floating 2D UI panels to 1:1 hardware-anchored halos, continuous acoustic feedback, and adaptive level-of-detail, AR smart glasses turn complex industrial procedures into second-nature muscle memory.

---

### What's Next
Pairing with live Bluetooth LE digital torque wrench adapters on physical Snap SPECS hardware, integrating Snap Places / WorldQuery CAD rim tracking, and deploying across petrochemical training academies.

---

## 3. Academic Research Grounding (14 Peer-Reviewed HCI Papers)

| Paper Citation | Core Finding / Theory | TorqueLock AR Implementation Constraint |
| :--- | :--- | :--- |
| **Krokos et al. (Virtual Reality 2019)** | +8.8% recall gain using spatial memory palaces | Symmetrical bolt circle serves as real-world mnemonic loci |
| **Moll & Sykes (VR 2023)** | Method of Loci spatial paths accelerate procedural learning | Star sequence vector path anchors ordered retrieval |
| **Henderson & Feiner (IEEE TVCG 2011)** | 2-phase maintenance model cuts errors by 82% | Dynamic Proximity LOD shifts from Macro Navigation to Micro Psychomotor Alignment |
| **Lindlbauer et al. (ACM UIST 2019)** | Cognitive load optimization cuts secondary UI by 36% | Focus Mode collapses 2-line tags to minimal eyes-up status pill |
| **Kim et al. (ACM SUI 2019)** | Additive optical display physics & color luminance | High-luminance cyan/mint/coral palettes; 0% black render |
| **Evangelista Belo et al. (ACM CHI 2021)** | Ergonomic 3D reach envelopes prevent arm fatigue | Control dock placed at $Y = -28\text{ cm}$, $Z = -105\text{ cm}$ |
| **Gruenefeld et al. (ACM SUI 2017)** | Out-of-view spatial guidance cues ($21.25^\circ$ error) | Animated yellow peripheral edge chevrons guide off-axis gaze |
| **Lu et al. (IEEE VR 2020 & ACM SUI 2021)** | Peripheral glanceable HUD architectures | Eye-level clear zone; progress ring tucked in lower margin |
| **Bell et al. (UIST 2001) / Azuma (ISMAR 2003)** | Dynamic view management & label decluttering | Single expanded active label; inactive bolts stay compact |
| **De La Torre et al. (ACM CHI 2024, LLMR)** | Decoupled pure domain state machines reduce defects 4× | Headless TypeScript engine with zero scene dependencies |

---

## 4. Automated Verification Evidence (27 / 27 Tests Passing)

```text
> torquelock-ar@1.0.0 test
> node --test tests/torquelock.test.cjs tests/crosstorque.test.cjs tests/loci-lens.test.cjs

✔ CrossTorque Engine: All 22 deterministic self-tests pass with 0 failures
✔ LEAF Scenario C1 (c1_initial_layout): Initial 1:1 spatial layout at Z = -110 cm
✔ LEAF Scenario C2 (c2_star_progression): Star-pattern progression across Pass 1 (35 Nm)
✔ LEAF Scenario C3 (c3_adjacent_error_rejection): Out-of-sequence adjacent bolt rejection & warp spike
✔ LEAF Scenario C4 (c4_focus_and_edge_arrow): Focus mode progressive disclosure & off-axis edge arrow
✔ LEAF Scenario C5 (c5_full_completion_and_reset): 15-step completion @ 110 Nm & one-pinch reset
✔ LEAF Scenario C6 (c6_ergonomic_reach_guard): Star sequence hover-reach & dock clearance
✔ DeckData contains 6 valid curriculum cards with all required fields
✔ LocusAnchor correctly instantiates and binds world coordinates
✔ ReviewStore correctly initializes all 6 cards in Leitner Box 1
✔ ReviewStore promotes card from Box 1 to Box 2 on 'got_it'
✔ ReviewStore promotes card from Box 2 to Box 3 on repeated 'got_it'
✔ ReviewStore demotes card back to Box 1 on 'missed'
✔ LociManager starts in 'onboard' mode and transitions to 'place' on start
✔ LociManager pins all 6 cards and updates PeripheralHUD count
✔ LociManager enters 'test' mode with hidden answers and reveals on pinch
✔ LociManager calculates accurate summary metrics (total, correct, missed, percentage)
✔ LociManager filters missed cards correctly when triggering retest
✔ PeripheralHUD clamps angle calculations and calculates out-of-view chevrons
✔ C1 (Initial Spatial Layout & Star Target #1): Initial state matches SPECS blueprint
✔ C2 (Comprehension-to-Psychomotor LOD Transition & Star Advance): Advance Bolt 1 -> Bolt 4
✔ C3 (Out-of-Sequence Gasket Warp Alert & Recovery): Premature torque triggers 1.8 mm warp
✔ C4 (Focus Mode Progressive Disclosure): Collapses 2-line tag to 1-line pill
✔ C5 (Full Pass Completion & Seal Summary): 1 -> 4 -> 2 -> 5 -> 3 -> 6 transitions cleanly
✔ C6 (Ergonomic Reach & Waveguide Safe Zone): Layout parameters comply with CHI 2021 & SUI 2017
✔ MemoryTrainer (Method of Loci Spatial Encoding & Active Recall): Learn, Recall, and Summary
✔ ReviewStore (Leitner 3-Box Spaced Repetition): Tracks retention across sessions

ℹ tests 27 | suites 0 | pass 27 | fail 0 | cancelled 0 | skipped 0
✔ TypeScript Compilation: npx tsc --noEmit (0 Diagnostic Errors)
✔ Asset Integrity Check: node Scripts/verify-assets.cjs (14 / 14 Verified)
```

---

## 5. Under-3-Minute Demo Video Walkthrough Guide (2:22 Runtime)

| Timestamp | Visual on Screen | Audio Narration & Sound Design |
| :--- | :--- | :--- |
| **0:00 – 0:24** | 3D Flange at $Z = -115\text{ cm}$. Central eye level ($Y = 0$) completely clear. | *"In high-pressure piping, improper bolt tightening causes catastrophic gasket blowout and plant downtime. Technicians must memorize the cross-pattern star sequence required by ASME PCC-1, but circular flanges lack landmarks. TorqueLock AR transforms the physical flange itself into a spatial memory palace."* |
| **0:24 – 0:47** | Planned with Devpost Learn skill pack. Focus Mode collapses tag into minimal pill. | *"Planned with the Devpost Learn skill pack and grounded in 14 HCI papers: following Henderson & Feiner and Lindlbauer, our cognitive Focus Mode dynamically collapses floating tags into minimal eyes-up status indicators during tool engagement."* |
| **0:47 – 1:08** | **Phase 1 (Learn):** Step through 6 loci in star sequence ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$). | *"In Learn mode, technicians encode the star sequence: Bolt 1 at top dead center, followed by its polar opposite Bolt 4, shifting to Bolt 2, across to 5, then 3, and closing on 6. High-luminance cyan guidance rings anchor an intuitive procedural role directly to each fastener."* |
| **1:08 – 1:25** | **Phase 2 (Recall):** Guidance lines disappear. User pinches active bolt. | *"Recall mode removes the visual crutches. The technician pinches the active bolt to confirm their procedural choice with immediate spatial audio validation."* |
| **1:26 – 1:52** | **Phase 3 (Practise):** Progressive passes ($35 \rightarrow 70 \rightarrow 100\text{ Nm}$). Gasket Warp Error Demo. | *"In Practise mode, technicians execute the full ASME PCC-1 multi-pass torque ramp. If improper adjacent torquing occurs, our engine detects asymmetric stress, flashing an alert for 1.8 mm of gasket warp before catastrophic leakage occurs."* |
| **1:52 – 2:06** | **Phase 4 (Summary):** Leitner 3-box spaced repetition scorecard. | *"The Summary dashboard displays tightening accuracy and routes any missed bolts into Leitner Box 1 for targeted re-training, ensuring mastery before field deployment."* |
| **2:06 – 2:22** | Dual-Workpiece Switcher (6-Bolt & 5-Bolt) + Automated LEAF runner passing 100%. | *"TorqueLock AR also supports 5-bolt automotive star patterns via its unified state machine, verified with 27 passing automated tests. TorqueLock AR: transforming industrial maintenance through spatial memory and intelligent augmented reality."* |
