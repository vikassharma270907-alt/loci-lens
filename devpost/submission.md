# CrossTorque AR — Devpost Hackathon Submission

**Hackathon:** Learn AR with SPECS (Devpost 2026)  
**Track:** Technical Implementation & Spatial Design  
**Platform:** Snap SPECS (Lens Studio 5.23.2 · SPECS 27 Interactive Preview)  
**Target Device:** Snap Spectacles (Gen 5)  
**Repository:** https://github.com/vky5/ar-specs-devpost  
**Built With:** `ar`, `clad`, `claude-code`, `leaf`, `lens-studio`, `lens-studio-mcp`, `snap-spectacles`, `spectacles-interaction-kit`, `typescript`  

---

## 1. Project Overview

### Project Title
**CrossTorque AR: 1:1 Star-Pattern Lug & Flange Torque Coach for Snap SPECS**

### Tagline (Short Description)
*Hands on the torque wrench, eyes on the hub: a 1:1 star-sequence guide on Snap SPECS that shows which bolt is next, catches gasket-warping adjacent mistakes before they happen, and goes quiet while you pull.*

---

## 2. Devpost Submission Story

### Inspiration
Anyone who has changed a car tire on a dark roadside shoulder or bolted a pressurized industrial flange knows the rule: you must tighten a 5-bolt pattern in a criss-cross star sequence (**Bolt 1 → Bolt 3 → Bolt 5 → Bolt 2 → Bolt 4**) across three progressive torque passes (**Pass 1: 35 Nm Snug seating**, **Pass 2: 75 Nm Intermediate elastic preload**, and **Pass 3: 110 Nm Final specification lock**). 

If you tighten adjacent bolts in a circle instead of crossing the center, you cock the clamping plane, warp the brake rotor (> 0.15 mm lateral runout), and trigger elastic bolt crosstalk that relaxes preload on neighboring studs. 

Yet all five M12 lug nuts look identical, and while both greasy hands are locked onto a heavy two-handed torque wrench, stopping to pick up a smartphone or check a paper manual means losing your place mid-pass.

---

### What It Does
CrossTorque AR is built around one hands-free spatial moment: crouching in front of a 5-bolt hub ($Z = -110\text{ cm}$) with a torque wrench in both hands.

1. **1:1 World-Anchored Star Sequence:**
   A glowing cyan target halo rings the active bolt head and a 3D star chord connects the current bolt to its opposite partner ($1 \rightarrow 3 \rightarrow 5 \rightarrow 2 \rightarrow 4$) across three passes: Pass 1 (35 Nm Snug), Pass 2 (75 Nm Intermediate), and Pass 3 (110 Nm Final Lock).
2. **Mistakes Explain Why (Deterministic Clamping Math):**
   Pinching or tightening an out-of-sequence adjacent bolt (for example, Bolt #2 right after Bolt #1) immediately flashes the flange callout coral-red with the calculated mechanical consequence: `BLOCKED: ADJACENT BOLT #2 CAUSES +0.24 mm WARP — TORQUE #3 NEXT`, keeping the halo locked on Bolt #3.
3. **Eyes-Up Focus Mode (Progressive Disclosure):**
   Pinching `[FOCUS MODE / RESET]` collapses the pass banner, star chord, and non-active bolt tags so only the active bolt ring remains visible while you pull the wrench. Eye level ($Y = 0\text{ cm}$) stays 100% clear at all times.
4. **Out-of-FOV Gaze Guidance:**
   If you turn your head away ($> 12^\circ$ off-axis), a bright yellow edge chevron (`LOOK RIGHT >> BOLT #3`) guides your eyes back to the target bolt.
5. **Scored Bench Debrief:**
   Completing all 15 steps (5 bolts $\times$ 3 passes = 110 Nm) replaces the active rings with a compact world-anchored debrief card showing final torque, rotor/flange runout ($0.02\text{ mm} \le 0.05\text{ mm}$), and total sequence mistakes.

---

### How I Built It
- **Plan-Lens Interview First:** Planned before writing any code using the Devpost Learn `plan-lens` skill (`challengepost/learn-specs`), which challenged the spatial layout against the SPECS 27 field of view ($32^\circ \times 28^\circ$ safe preview frame) and preview limits to produce `devpost/design-brief.md` (status: approved) with exact centimeter coordinates and five testable Done Criteria.
- **Pure TypeScript Engine:** All star-sequence graph logic, asymmetric flange-warp calculations (mm), off-axis gaze trigonometry, and 3-pass state transitions live in a zero-dependency TypeScript file (`Assets/Scripts/CrossTorqueEngine.ts`) verified by 22 built-in unit assertions on startup.
- **Scene Architecture & SIK:** Using CLAD and Lens Studio MCP, the scene controller (`Assets/Scripts/CrossTorqueController.ts`) generates the procedural 5-bolt hub and target rings (`MeshBuilder`), wires Spectacles Interaction Kit (`Interactable`) pinches on all 5 bolts and the three $15.0 \times 7.5\text{ cm}$ lower-field stand-in buttons ($Y = -29\text{ cm}$, $Z = -95\text{ cm}$), and configures low-latency audio (`Audio.PlaybackMode.LowLatency`).
- **Automated LEAF Test Suite:** Every Done Criterion from `devpost/design-brief.md`, plus an ergonomic collider-reach regression guard, is verified by an automated LEAF 2.0.2 scenario (`c1_initial_layout` through `c6_ergonomic_reach_guard`), with all 6 of 6 scenarios passing in the SPECS 27 Preview.

---

### Challenges I Ran Into
Lens Studio 5.24 initially blocked CLAD readiness checks behind a developer sign-in gate; downgrading to Lens Studio 5.23.2 per the hackathon update fixed the MCP connection immediately. 

Additionally, at $Z = -110\text{ cm}$, the safe preview frame spans $63.1 \times 54.9\text{ cm}$. Early single-line warp warnings clipped at the horizontal edges, and dark backing cards turned transparent on the additive display. Iterative design notes shrank text widths under $32\text{ cm}$, switched to high-luminance cyan/mint/coral fills, and pushed the control dock down to $Y = -29\text{ cm}$ so it never occluded Bolt #3 or Bolt #4.

---

### What I Learned
On AR glasses, the answer belongs on the bolt itself rather than on a floating panel: a glowing ring on Bolt #3 and a star line across the hub answer "where does the wrench go next?" instantly while keeping eye level clear. 

Furthermore, following "fake the sensing, keep the response"—pairing clickable 3D bolt heads with three honest $15 \times 7.5\text{ cm}$ stand-in dock buttons—made it possible to prove and test the entire 3-pass mechanical coaching loop inside the laptop preview.

---

### What's Next for CrossTorque AR
Pair with a live BLE digital torque adapter on physical Snap SPECS hardware and use WorldQuery / CAD rim tracking to anchor onto 4-, 5-, 6-, and 8-bolt industrial flanges automatically.

---

## 3. Under-3-Minute YouTube Demo Video Storyboard & Narration Script (2:15 Total Runtime)

| Timestamp | Visual on Screen (Screen Recording of Lens Studio 5.23.2 Preview) | Voiceover Narration Script |
| :--- | :--- | :--- |
| **0:00 – 0:20** | Live SPECS 27 Interactive Preview open at $Z = -110\text{ cm}$ showing the 5-bolt hub, Bolt #1 glowing cyan, and clear eye level. (Start directly in the running Lens preview without title slides.) | *"When you're tightening a 5-bolt wheel hub or pressurized flange with a two-handed torque wrench, tightening in a circle warps the rotor or blows the seal. You have to follow a 1-3-5-2-4 star pattern across three torque passes—and with both greasy hands on the wrench, you can't hold a phone. This is CrossTorque AR running in the Lens Studio 5.23.2 SPECS preview."* |
| **0:20 – 0:50** | Uncut 30-second interactive walk-through (C1 & C2): Use WASD and mouse look to show eye level ($Y = 0\text{ cm}$) is empty. Pinch Bolt_1 (#1 · 35 Nm ✓), watch the cyan ActiveHalo and star chord jump across the center to Bolt_3. Pinch BtnTorquePulse to step through $3 \rightarrow 5 \rightarrow 2 \rightarrow 4$ into Pass 2 (75 Nm). | *"Every element sits on the hardware it describes at 1:1 scale at Z minus 110 centimeters. Because the laptop preview can't sense a real torque wrench, pinching a bolt head or the 15-by-7.5 centimeter dock button stands in for the wrench click. Pinching Bolt 1 logs 35 Newton-meters and jumps the target across the star chord to Bolt 3, advancing into Pass 2 at 75 Newton-meters."* |
| **0:50 – 1:15** | Out-of-sequence mistake rejection (C3): With Bolt_3 glowing as the active target, pinch adjacent Bolt_2 (or BtnWrongBolt). Show the coral-red callout: `BLOCKED: ADJACENT BOLT #2 CAUSES +0.24 mm WARP — TORQUE #3 NEXT`. | *"If I lose my place and tighten adjacent Bolt 2 instead of opposite Bolt 3, the pure TypeScript engine calculates the asymmetric clamping moment—0.24 millimeters of flange warp—blocks the step, and tells me why Bolt 3 has to go next."* |
| **1:15 – 1:40** | Focus Mode & Out-of-FOV Edge Arrow (C4): Pinch [FOCUS MODE / RESET] to collapse the top banner and star chord so only Bolt_3's ring remains. Right-drag camera yaw $18^\circ$ left; show the bright yellow `LOOK RIGHT >> BOLT #3` edge arrow appear and vanish when looking back. | *"While pulling the wrench, pinching Focus Mode hides all secondary text so only the active bolt glows. And if I look away from the hub, a bright yellow edge arrow guides my eyes right back to Bolt 3 within the narrow 32-degree SPECS frame."* |
| **1:40 – 2:15** | Full 110 Nm Debrief (C5) & Live LEAF Runner (6/6 PASSED): Complete Pass 3 (110 Nm) to reveal the SEAL VERIFIED debrief card, then split-screen the LEAF Panel and Logger Panel running c1 through c6 with 22/22 unit checks and 6/6 PASSED. | *"Finishing all 15 steps locks the hub at 110 Newton-meters with 0.02 millimeters of runout and displays the debrief card. We planned CrossTorque AR with the Devpost Learn plan-lens skill into devpost/design-brief.md, built it with CLAD and the Lens Studio MCP, and locked in all five Done Criteria plus a reach guard with six automated LEAF scenarios—all passing in the preview."* |

---

## 4. Verification Evidence & Test Run Matrix

| Test Suite / Tool | Command / Scenario | Target Specification | Observed Result | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Pure TS Unit Tests** | `runCrossTorqueEngineSelfTests()` | 22 Math & State Invariants | **22 / 22 Assertions Passed** | **PASS** |
| **LEAF Scenario C1** | `c1_initial_layout` | Hub at $Z = -110\text{ cm}$, Pass 1 (35 Nm), Bolt 1 Active | **Passed (0 failures)** | **PASS** |
| **LEAF Scenario C2** | `c2_star_progression` | $1 \rightarrow 3 \rightarrow 5 \rightarrow 2 \rightarrow 4$ Star Advancement to Pass 2 | **Passed (0 failures)** | **PASS** |
| **LEAF Scenario C3** | `c3_adjacent_error_rejection` | Adjacent Bolt 2 Blocked ($+0.24\text{ mm}$ Warp Callout) | **Passed (0 failures)** | **PASS** |
| **LEAF Scenario C4** | `c4_focus_and_edge_arrow` | Focus Mode LOD Reduction & $18^\circ$ Yaw Edge Chevron | **Passed (0 failures)** | **PASS** |
| **LEAF Scenario C5** | `c5_full_completion_and_reset` | 15 Steps @ 110 Nm, Debrief Card Display & Hub Reset | **Passed (0 failures)** | **PASS** |
| **LEAF Scenario C6** | `c6_ergonomic_reach_guard` | Hover Reach & Zero Dock-to-Bolt Collider Overlap | **Passed (0 failures)** | **PASS** |
| **TypeScript Compiler** | `npx tsc --noEmit` | Strict ES2022 / Lens Studio Type Safety | **0 Diagnostic Errors** | **PASS** |
| **Node Test Harness** | `npm test` | Automated CI Regression Testing across all suites | **27 / 27 Tests Passed** | **PASS** |
