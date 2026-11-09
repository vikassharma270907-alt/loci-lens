# TorqueLock AR — Project Context & System Overview

## Project Metadata
- **Project Name:** TorqueLock AR — Spatial Memory & Procedural Flange Torquing Coach
- **Target Platform:** Snap SPECS 27 (Lens Studio v5.23 / v5.24)
- **Author / Team:** Devpost Learn SPECS Hackathon Team
- **Development Stack:** Lens Studio, TypeScript, Spectacles Interaction Kit (SIK), Spectacles UI Kit (SUIK), Lens Studio MCP Server, CLAD (Closed-loop Agentic Development), LEAF Testing Framework.
- **Planning Authority:** `devpost/design-brief.md` (Generated via Devpost Learn SPECS skill pack `plan-lens`, approved).
- **Industrial Reference:** ASME PCC-1 (*Guidelines for Pressure Boundary Bolted Flange Joint Assembly*).

---

## 1. Executive Summary & Problem Space

In high-pressure industrial facilities (petrochemical refineries, power generation, chemical processing, municipal water), the integrity of bolted flange joints is critical to life safety and environmental containment. When a circular flange is assembled incorrectly, the internal gasket suffers asymmetric compression, causing catastrophic gasket blowouts, hazardous chemical leaks, and multimillion-dollar downtime.

To ensure uniform gasket crush, **ASME PCC-1** mandates a strict cross-pattern (star) tightening sequence ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$ on a 6-bolt flange) executed across multiple progressive torque passes ($35\text{ Nm} \rightarrow 70\text{ Nm} \rightarrow 100\text{ Nm}$).

However, circular industrial flanges are rotationally symmetrical and feature zero natural spatial landmarks. When technicians hold a heavy mechanical torque wrench while glancing back and forth at a 2D paper chart or tablet, they experience severe context-switching latency, lose track of their position, and make procedural errors.

### The Innovation: Flange as Memory Palace
TorqueLock AR applies the ancient **Method of Loci** ("Memory Palace") directly to the industrial workpiece. Rather than an arbitrary room full of flashcards, **the six physical bolt positions on the circular flange become the mnemonic loci**.

By projecting 1:1 spatially registered augmented reality indicators onto the physical workpiece through **Snap SPECS**, TorqueLock AR eliminates context switching, optimizes cognitive load, and turns procedural execution into intuitive muscle memory.

---

## 2. The Four Experience Phases

```
+---------------------------------------------------------------------------------------+
|                                    TorqueLock AR                                      |
+---------------------------------------------------------------------------------------+
|  [Phase 1: LEARN]    --> Associate 6 bolt nodes with spatial mnemonic cues (1->4->2..) |
|  [Phase 2: RECALL]   --> Hide sequence; test unassisted retrieval; score Got It/Missed|
|  [Phase 3: PRACTISE] --> 3D Flange simulation; active target ring; 3 passes; warp alert|
|  [Phase 4: SUMMARY]  --> Accuracy score, missed bolt positions, Leitner review schedule|
+---------------------------------------------------------------------------------------+
```

### Phase 1: Learn (Spatial Loci Encoding)
- Displays the 1:1 scale six-bolt industrial flange ($42 \times 8 \times 42\text{ cm}$) at $(0, -18, -115)\text{ cm}$.
- Guides the technician through the ASME PCC-1 star sequence: **$1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$**.
- Anchors intuitive procedural roles to each fastener locus:
  - **Bolt 1 (Top Dead Center):** *Anchor Locus* — Assembly baseline.
  - **Bolt 4 (Polar Opposite):** *Cross Locus* — Diametrical load equalization.
  - **Bolt 2 (Clockwise Adjacent):** *Shift Locus* — $+60^\circ$ pair shift.
  - **Bolt 5 (Polar Opposite):** *Cross Locus* — Balances B2 across the centerline.
  - **Bolt 3 (Lower Right):** *Shift Locus* — Final pair shift.
  - **Bolt 6 (Polar Opposite):** *Closure Locus* — Symmetrical seal completion.

### Phase 2: Recall (Active Cognitive Retrieval)
- Removes guidance arrows and numbering crutches.
- Prompts the user: *"Which bolt comes next in the cross pattern?"*
- Technician points and pinches the active bolt via SIK.
- Immediate spatial-audio confirmation reinforces memory pathways before live wrenching.

### Phase 3: Practise (Progressive Torque Ramp & Gasket Warp Alert)
- Technicians simulate the ASME PCC-1 three-pass torque ramp:
  - **Pass 1:** $35\text{ Nm}$ ($40\%$ nominal crush)
  - **Pass 2:** $70\text{ Nm}$ ($70\%$ nominal crush)
  - **Pass 3:** $100\text{ Nm}$ ($100\%$ uniform seal)
- **Cognitive Focus Mode (Henderson & Feiner 2011, Lindlbauer et al. 2019):** Floating 2-line tags collapse into a minimal 1-line eyes-up status pill (`P1 · B1 · 35 Nm`) during tool use to prevent visual occlusion.
- **Real-Time Gasket Warp Detection:** If a technician attempts circular adjacent tightening (e.g. B2 immediately after B1), the engine calculates non-uniform stress ($1.8\text{ mm}$ deflection) and triggers an immediate coral red visual warning and alarm buzzer before gasket failure occurs.

### Phase 4: Summary (Leitner 3-Box Spaced Repetition)
- Displays overall session accuracy, pass completion, and sequence efficiency.
- Routes missed or warped bolts into **Leitner 3-Box Spaced Repetition**:
  - **Box 1 (Daily Remediation):** Erroneous bolt positions queued for immediate re-testing.
  - **Box 2 (3-Day Review):** Intermediate retention items.
  - **Box 3 (Mastered Loci):** Perfect unassisted recall.
- Instant remediation loop accessible with a single SIK pinch.

---

## 3. Cognitive Science Foundations (14 Papers)

1. **Krokos et al. (VR 2019):** +8.8% recall gain via head-tracked spatial memory palaces.
2. **Moll & Sykes (VR 2023):** Method of Loci spatial paths accelerate procedural learning.
3. **Henderson & Feiner (TVCG 2011):** 2-phase procedural AR (Comprehension vs. Psychomotor); cuts errors by 82%.
4. **Lindlbauer et al. (UIST 2019):** Cognitive load Knapsack optimization cuts secondary UI by 36%.
5. **Kim et al. (SUI 2019):** Additive waveguide optics design (high-luminance HUD against dark backgrounds).
6. **Evangelista Belo et al. (CHI 2021) & Fender et al. (ISMAR 2022):** Lower-field ergonomic UI dock ($y = -28\text{ cm}$, $z = -105\text{ cm}$) prevents arm fatigue.
7. **De La Torre et al. (CHI 2024):** Decoupled pure domain state machines reduce 3D XR defects by 4×.
8. **Lu et al. (IEEE VR 2020 & ACM SUI 2021):** Peripheral HUD architecture and intentional activation.
9. **Gruenefeld et al. (ACM SUI 2017):** Out-of-view spatial guidance chevrons ($21.25^\circ$ error, 84.5% success).
10. **Bell et al. (UIST 2001) & Azuma & Furmanski (ISMAR 2003):** Dynamic view management and label decluttering.
11. **Lee et al. (ACM UIST 2025):** Unobtrusive multimodal AR agent interaction.

---

## 4. Technical Verification & Done Criteria
- **20 / 20 Automated Tests Passing (100% OK):** Verified via `npm test` across Done Criteria C1 through C6.
- **LEAF Scenario Suite (`TorqueLockScenarios.ts`):** Deterministic evaluation within Lens Studio.
- **Standalone Optical Preview (`preview/`):** Perspective 3D simulator modeling the $37^\circ\text{ V} \times 32^\circ\text{ H}$ waveguide display, audio synth, Focus Mode, and live test runner at `http://localhost:8080/`.
- **Demo Video:** `torquelock_ar_demo_walkthrough.mp4` (1080p, 2m 22s, fully narrated, subtitle tracks, thumbnail).
- **Safety Boundaries:** Pure simulation; transparent disclaimers; ASME PCC-1 sequence education only.
