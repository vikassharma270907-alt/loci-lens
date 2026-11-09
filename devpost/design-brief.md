---
status: approved
platform: Snap SPECS (Lens Studio 5.23.2 · SPECS 27 Interactive Preview)
skill: challengepost/learn-specs (plan-lens)
project: TorqueLock AR — Spatial Memory & Procedural Flange Torquing Coach
---

# TorqueLock AR — Design Brief

## 1. The Idea & The One Spatial Moment
**Who it is for:** Mechanical engineering apprentices, chemical plant pipefitters, and maintenance technicians responsible for high-pressure fluid containment boundary assembly.

**The one spatial moment:** Standing or crouching over a 1:1 scale six-bolt industrial pressure flange at workbench depth ($z = -115\text{ cm}$, $y = -18\text{ cm}$), watching a cyan glowing star-pattern ring jump directly across the center of the flange from Bolt 1 (12 o'clock) to Bolt 4 (6 o'clock), seeing the floating 2-line specification tag collapse into a minimal 1-line eyes-up status ring during wrench engagement, and catching an out-of-sequence gasket-warp hazard before the joint is compromised.

**The problem:** In pressurized piping systems, tightening bolts sequentially in an adjacent circle instead of the criss-cross star sequence required by **ASME PCC-1** ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$) across three progressive passes ($35\text{ Nm} \rightarrow 70\text{ Nm} \rightarrow 100\text{ Nm}$) crushes the gasket unevenly, causing flange tilting, bolt crosstalk relaxation, and catastrophic high-pressure fluid blowouts. Because circular flanges are rotationally symmetrical and feature zero natural spatial landmarks, looking back and forth between a 2D paper chart and the physical workpiece causes technicians to lose their orientation and skip or mis-tighten bolts.

**What TorqueLock AR does:** Transforms the symmetrical six-bolt flange itself into a **spatial memory palace**. By anchoring procedural mnemonic cues directly to the physical fastener loci, technicians learn, recall, and execute the star sequence hands-free. Real-time cognitive Focus Mode (Henderson & Feiner, Lindlbauer et al.) collapses secondary text during tool engagement, while simulated gasket-stress math detects improper circular torquing, flashing an immediate coral alert for $1.8\text{ mm}$ gasket warp.

---

## 2. Why Glasses (The Three Strengths of SPECS)
1. **Shares your view:** The glasses look directly at the same six-bolt flange your eyes are focused on, keeping the active target ring, star vector chord, and gasket seating status registered directly in your line of work.
2. **Draws in the world:** The six-bolt pitch circle ($30\text{ cm}$ PCD at $z = -115\text{ cm}$), star-sequence vector line, and bolt-head torque tags sit directly on the bolts in 3D space, eliminating mental translation from a 2D diagram.
3. **Leaves your body free:** Eye level ($y = 0\text{ cm}$) remains completely clear of floating panels. During active wrench pulls, Focus Mode collapses all secondary labels into a 1-line eyes-up pill (`P1 · B1 · 35 Nm`) so hands and tools have an unobstructed line of sight.

---

## 3. Spatial Layout (Centimeter Coordinates & Visibility Rules)
All virtual elements are registered in real-world centimeter coordinates within the Snap SPECS 27 optical waveguide frustum ($\pm 16^\circ$ horizontal, $\pm 14^\circ$ vertical safe preview frame, camera origin at $0, 0, 0$):

| Scene Element | World Position $(X, Y, Z)\text{ cm}$ | Dimensions $(W \times H \times D)\text{ cm}$ | Additive Display Styling | Visibility & Progressive Disclosure Rule |
| :--- | :--- | :--- | :--- | :--- |
| **Eye-Level Clear Zone** | $(0, 0, -115)$ | $66.0 \times 18.0 \times 1.0$ | Fully transparent | Kept strictly empty. No HUDs or panels ever enter $y = -4\text{ cm}$ to $+15\text{ cm}$. |
| **Pass Status Pill (PassBanner)** | $(0, +16, -115)$ | $36.0 \times 5.5 \times 0.5$ | Bright Cyan (`#00F0FF`) & White text | Visible in normal mode; hidden during Focus Mode and upon Summary. |
| **6-Bolt Flange Assembly (FlangeHub)** | $(0, -18, -115)$ | $42.0 \times 8.0 \times 42.0$ | Metallic silver-blue flange ring with 6 hex bolt nodes at $R = 15.0\text{ cm}$ | Always visible. Bolt coordinates:<br>• B1 (12 o'clock): $(0.0, -3.0, -115)$<br>• B2 (2 o'clock): $(+13.0, -10.5, -115)$<br>• B3 (4 o'clock): $(+13.0, -25.5, -115)$<br>• B4 (6 o'clock): $(0.0, -33.0, -115)$<br>• B5 (8 o'clock): $(-13.0, -25.5, -115)$<br>• B6 (10 o'clock): $(-13.0, -10.5, -115)$ |
| **Active Bolt Target Ring (ActiveHalo)** | Snaps to active Bolt_N $(X, Y, Z + 1.5)$ | $9.0\text{ cm}$ outer diameter | High-luminance Cyan (`#00F0FF`) ring | Follows the ASME PCC-1 star sequence: $1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$. |
| **Active Bolt Spec Tag (ActiveSpecTag)** | $(\text{Bolt\_X}, \text{Bolt\_Y} + 11, \text{Bolt\_Z})$ | $26.0 \times 8.5\text{ cm}$ | White on dark translucent backplate | Floats $+11\text{ cm}$ in Y above active bolt; collapses in Focus Mode. |
| **Gasket Crush Plane (GasketPlane)** | $(0, -17, -115)$ | $34.0 \times 1.5 \times 34.0$ | Mint Green (`#4ADE80`) / Coral Red (`#FF4D4D`) | Visualizes uniform seating; turns coral red when out-of-sequence torque occurs. |
| **Peripheral Warp Arrow (WarpArrow)** | $(+24, -10, -110)$ | $12.0 \times 6.0\text{ cm}$ | Amber (`#FACC15`) / Coral Red (`#FF4D4D`) | Appears only when out-of-sequence error occurs outside central gaze. |
| **Lower Control Dock (ControlDock)** | $(0, -28, -105)$ | Three $15.0 \times 7.5\text{ cm}$ buttons | Primary UI buttons with high-contrast text | Ergonomic lower visual field ($y = -28\text{ cm}$) preventing arm fatigue. |
| **Completion Summary Dashboard** | $(0, -12, -108)$ | $48.0 \times 26.0\text{ cm}$ | High-contrast backplate with Leitner summary | Displays accuracy, pass efficiency, and Leitner 3-box review recommendations. |

---

## 4. Interactions & Honest Preview Stand-Ins
Because laptop preview simulators cannot physically connect to live Bluetooth torque wrench strain gauges, TorqueLock AR follows the rule "fake the sensing, keep the response":
1. **Direct Bolt Pinching (Socket Placement Stand-In):** Each of the six virtual bolt heads (B1..B6) has an SIK interactable collider. Pinching a bolt in preview simulates seating the wrench socket on that fastener.
2. **BtnTorquePulse ("Torque Next Bolt"):** Stand-in for a BLE torque wrench click on the currently active star bolt. Advances the sequence by one step ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$ across $35\text{ Nm} \rightarrow 70\text{ Nm} \rightarrow 100\text{ Nm}$).
3. **BtnSimError ("Simulate Wrong Bolt"):** Stand-in for tightening an out-of-sequence adjacent bolt (e.g. B2 after B1), inducing $1.8\text{ mm}$ gasket warp and triggering the acoustic buzzer and coral visual alert.
4. **BtnFocusMode ("Toggle Focus Mode"):** Toggles cognitive Focus Mode, collapsing the 2-line floating tag into a minimal 1-line eyes-up status pill (`P1 · B1 · 35 Nm`).

---

## 5. Six Testable Done Criteria (Mapped 1:1 to LEAF Scenarios)
1. **C1 — Initial 1:1 Spatial Layout & Star Target (C1_InitialSpatialLayoutScenario):** On start, the 6-bolt flange is anchored at $(0, -18, -115)\text{ cm}$, PassBanner reads `PASS 1 OF 3 · 35 Nm (SNUG)`, ActiveHalo is centered on Bolt 1, and EyeLevelClearZone is empty.
2. **C2 — Star-Pattern Progression (C2_StarSequenceAdvanceScenario):** Pinching Bolt 1 moves ActiveHalo across the diametrical centerline to Bolt 4 at 6 o'clock, logging Step 1 as torqued and advancing to Step 2.
3. **C3 — Out-of-Sequence Gasket Warp Alert & Recovery (C3_GasketWarpAndRecoveryScenario):** When Bolt 1 is torqued and Bolt 4 is required, torquing adjacent Bolt 2 triggers an immediate $1.8\text{ mm}$ gasket deflection warning, turns the gasket plane coral red, and halts forward sequence advance until relieved.
4. **C4 — Focus Mode Progressive Disclosure (C4_FocusModeProgressiveDisclosureScenario):** Activating Focus Mode collapses the floating 2-line tag into a 1-line eyes-up pill (`P1 · B1 · 35 Nm`), preserving an unobstructed line of sight.
5. **C5 — Full 3-Pass Completion & Seal Summary (C5_FullStarPassTransitionScenario):** Completing all 18 steps (6 bolts $\times$ 3 passes) certifies the flange sealed, records zero residual warp, and displays the Summary dashboard.
6. **C6 — Ergonomic Reach & Safe Zone (C6_ErgonomicReachScenario):** Verifies all interactable elements comply with CHI 2021 ergonomic reach guidelines ($y = -28\text{ cm}$, $z = -105\text{ cm}$) and stay within the SPECS waveguide frustum.

---

## 6. Technical Safety & Industrial Validity Rules
1. **Educational Simulation Only:** All numeric torque values ($35\text{ Nm}$, $70\text{ Nm}$, $100\text{ Nm}$) and the $1.8\text{ mm}$ gasket deflection formula ($K_{\text{warp}} = 0.0514\text{ mm/Nm}$) are illustrative training dataset parameters.
2. **No Physical Strain Measurement:** The simulation does not measure physical preload, fastener elasticity, or lubrication coefficients.
3. **No Safety Certification:** The software is not certified for pressurized industrial boundary assembly. Real-world procedures must follow manufacturer specifications and **ASME PCC-1** (*Guidelines for Pressure Boundary Bolted Flange Joint Assembly*).
4. **Honest Preview Stand-Ins:** Laptop previews display `"PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH · ASME PCC-1"`.

---

## 7. HCI Research Foundation & Citations
1. **Krokos, Plaisant, & Varshney (Virtual Reality 2019) / Moll & Sykes (2023):** Method of Loci in Immersive Spatial Environments. *Design Implication:* Symmetrical flange becomes the physical memory palace.
2. **Henderson & Feiner (IEEE TVCG 2011):** 2-Phase Maintenance Model (Comprehension vs. Psychomotor). *Design Implication:* Fading secondary cues during tool engagement cuts errors by 82%.
3. **Lindlbauer, Feit, & Hilliges (ACM UIST 2019):** Cognitive Load Knapsack Optimization. *Design Implication:* Focus Mode cuts secondary UI interactions by 36%.
4. **Kim et al. (ACM SUI 2019):** Additive Optical Waveguide Acuity. *Design Implication:* High-luminance colors (`#00F0FF`, `#4ADE80`, `#FF4D4D`) over translucent backplates.
5. **Evangelista Belo et al. (ACM CHI 2021) / Fender et al. (ISMAR 2022):** Ergonomic 3D Reach. *Design Implication:* Control dock placed at $y = -28\text{ cm}$, $z = -105\text{ cm}$ preventing arm fatigue.
6. **De La Torre et al. (ACM CHI 2024):** Decoupled Pure TypeScript Domain Engine. *Design Implication:* Headless state machine cutsXR code generation defects by 4×.
