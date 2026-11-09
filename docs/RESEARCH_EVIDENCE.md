# TorqueLock AR — Academic Research Evidence & Design Foundations

This document provides the complete academic synthesis of **fourteen peer-reviewed Human-Computer Interaction (HCI) and Cognitive Science research papers**, accompanied by industrial engineering standards, grounding every spatial, visual, and algorithmic decision in **TorqueLock AR**.

---

## 1. Spatial Memory & The Method of Loci

### 1.1 Krokos, Plaisant, & Varshney (2019)
- **Citation:** Krokos, E., Plaisant, C., & Varshney, A. (2019). *Virtual memory palaces: immersion aids recall.* *Virtual Reality*, 23(1), 1–15. [DOI: 10.1007/s10055-018-0346-3](https://doi.org/10.1007/s10055-018-0346-3)
- **Empirical Findings:** In a controlled study ($N=40$), participants memorizing face-location pairings in a head-tracked immersive display achieved an **8.8% recall accuracy gain** over a traditional desktop mouse condition. Immersion engages vestibular-ocular proprioception and head rotation, reinforcing cognitive indexing in the hippocampus.
- **SPECS Engineering Rule:** The six bolt positions on the circular flange serve as the physical memory locations (*loci*). Rather than a generic room full of arbitrary flashcards, the industrial workpiece itself becomes the spatial memory palace.

### 1.2 Moll & Sykes (2023)
- **Citation:** Moll, B., & Sykes, E. (2023). *Optimized virtual reality-based Method of Loci memorization techniques through increased immersion and effective memory palace designs: a feasibility study.* *Virtual Reality*, 27(2), 941–966. [DOI: 10.1007/s10055-022-00700-z](https://doi.org/10.1007/s10055-022-00700-z)
- **Empirical Findings:** Demonstrated that users can acquire spatial mnemonic associations with rapid onboarding, showing marked recall improvements when structured along an ordered pathway.
- **SPECS Engineering Rule:** Structure the experience into progressive stages: **LEARN** (associate the star sequence with spatial cues), **RECALL** (hide visible guidance and test unassisted retrieval), **PRACTISE** (procedural torquing simulation), and **SUMMARY** (Leitner review of missed steps).

---

## 2. Glanceable AR & Information Architecture

### 2.1 Lu et al. (IEEE VR 2020)
- **Citation:** Lu, F., Davari, S., Lisle, L., Li, Y., & Bowman, D. A. (2020). *Glanceable AR: Evaluating Information Access Methods for Head-Worn Augmented Reality.* *IEEE Conference on Virtual Reality and 3D User Interfaces (VR)*, 930–939. [DOI: 10.1109/VR46266.2020.00113](https://doi.org/10.1109/VR46266.2020.00113)
- **Empirical Findings:** Evaluated peripheral vs. central information delivery in optical see-through AR. Placing secondary data in the peripheral visual field accessible by brief eye or head glances dramatically reduced primary task interference compared to persistent central HUD modals.
- **SPECS Engineering Rule:** The Eye-Level Clear Zone ($y = -4\text{ cm}$ to $+15\text{ cm}$, $z = -115\text{ cm}$) is kept strictly empty. Progress rings and telemetry reside in the lower periphery.

### 2.2 Lu, Davari, & Bowman (ACM SUI 2021)
- **Citation:** Lu, F., Davari, S., & Bowman, D. A. (2021). *Exploration of Techniques for Rapid Activation of Glanceable Information in Head-Worn Augmented Reality.* *ACM SUI '21*, Article 6. [DOI: 10.1145/3485279.3485286](https://doi.org/10.1145/3485279.3485286)
- **Empirical Findings:** Passive or accidental summoning of virtual cards while walking or manipulating objects causes high user frustration and visual occlusion. Intentional, lightweight activation is critical.
- **SPECS Engineering Rule:** Require deliberate SIK pinch interactions to commit steps or trigger reveals, preventing accidental activation while maintaining high interaction reliability.

### 2.3 Gruenefeld et al. (ACM SUI 2017)
- **Citation:** Gruenefeld, U., et al. (2017). *EyeSee360: Designing a Visualization Technique for Out-of-view Objects in Head-mounted Augmented Reality.* *ACM SUI '17*, 109–118. [DOI: 10.1145/3131277.3132175](https://doi.org/10.1145/3131277.3132175)
- **Empirical Findings:** In narrow-FOV smart glasses, direction estimation error for out-of-view targets increases from $24.06\%$ in the forward $180^\circ$ hemisphere to $31.31\%$ in full $360^\circ$ space. Structured peripheral indicators achieved the lowest direction error ($21.25^\circ$) and $84.5\%$ localization success.
- **SPECS Engineering Rule:** Keep the entire workspace constrained within the forward hemisphere ($x = -15\text{ cm}$ to $+15\text{ cm}$ at $z = -100\text{ cm}$ to $-130\text{ cm}$). When an out-of-sequence error occurs, display a high-contrast peripheral arrow (`PeripheralWarpArrow` at $x = +24\text{ cm}$) pointing directly to the warped node.

---

## 3. View Management & Preventing Label Clutter

### 3.1 Bell, Feiner, & Höllerer (ACM UIST 2001)
- **Citation:** Bell, B., Feiner, S., & Höllerer, T. (2001). *View Management for Virtual and Augmented Reality.* *ACM UIST '01*, 101–110. [DOI: 10.1145/502348.502363](https://doi.org/10.1145/502348.502363)
- **Empirical Findings:** Projected 2D labels pinned naively to multiple 3D spatial anchors occlude underlying workpieces and overlap with each other as perspective changes.
- **SPECS Engineering Rule:** Never render expanded specification cards on all 6 bolts simultaneously. Only the single active target bolt displays an expanded 2-line specification tag; completed bolts render compact, unobtrusive badges.

### 3.2 Azuma & Furmanski (IEEE/ACM ISMAR 2003)
- **Citation:** Azuma, R., & Furmanski, C. (2003). *Evaluating Label Placement for Augmented Reality View Management.* *IEEE/ACM ISMAR '03*, 66–75. [DOI: 10.1109/ISMAR.2003.1240689](https://doi.org/10.1109/ISMAR.2003.1240689)
- **Empirical Findings:** Dynamic cluster-based label placement in unoccupied screen space significantly improves legibility and comprehension compared to fixed overlapping billboards.
- **SPECS Engineering Rule:** `ActiveBoltSpecTag` floats $+11\text{ cm}$ vertically in Y above the active bolt head, preserving an unobstructed direct line-of-sight to the bolt itself.

---

## 4. Procedural AR & Cognitive Load Optimization

### 4.1 Henderson & Feiner (IEEE TVCG 2011)
- **Citation:** Henderson, S., & Feiner, S. (2011). *Exploring the Benefits of Augmented Reality Documentation for Maintenance and Repair.* *IEEE TVCG*, 17(10), 1355–1368. [DOI: 10.1109/TVCG.2010.245](https://doi.org/10.1109/TVCG.2010.245)
- **Empirical Findings:** Mechanics performing maintenance divided tasks into two distinct phases:
  1. *Comprehension Phase:* Locating the target component and reading specifications.
  2. *Psychomotor Phase:* Physical manipulation of the fastener with tools.
  Spatially registered 3D AR cues reduced head rotation velocity, localization time, and **decreased assembly error rates by 82%**. Fading 3D attention cues after localization prevented tool occlusion.
- **SPECS Engineering Rule:** During the Comprehension Phase, show the floating specification tag and 3D beacon. The instant the user engages the bolt (Psychomotor Phase), secondary text collapses, leaving only an unobstructed 1:1 circular progress ring directly around the bolt head.

### 4.2 Lindlbauer, Feit, & Hilliges (ACM UIST 2019)
- **Citation:** Lindlbauer, D., Feit, A. M., & Hilliges, O. (2019). *Context-Aware Online Adaptation of Mixed Reality Interfaces.* *ACM UIST '19*, 55–70. [DOI: 10.1145/3332165.3347945](https://doi.org/10.1145/3332165.3347945)
- **Empirical Findings:** Formulated cognitive-load adaptation as an Integer Linear Program (ILP) Knapsack solver. Dynamically reducing virtual Level of Detail (LOD) during high-load physical tasks **decreased secondary task UI interactions by 36% ($p < 0.001$)** with zero penalty to primary task completion time.
- **SPECS Engineering Rule:** Implemented in `FocusController.ts`: when Focus Mode is activated, the 2-line specification tag collapses into a compact 1-line eyes-up status pill (`P1 · B1 · 35 Nm`), reducing visual clutter while keeping the 1:1 target ring active.

---

## 5. 3D Reach Ergonomics & Display Physics

### 5.1 Evangelista Belo et al. (ACM CHI 2021) & Fender et al. (ISMAR 2022)
- **Citation:** Evangelista Belo, J. M., et al. (2021). *XRgonomics: Facilitating the Creation of Ergonomic 3D Interfaces.* *ACM CHI '21*, Article 607. [DOI: 10.1145/3411764.3445349](https://doi.org/10.1145/3411764.3445349)
- **Citation:** Fender, A. R., Lindlbauer, D., et al. (2022). *ComforTable User Interfaces.* *IEEE ISMAR '22*, 293–302.
- **Empirical Findings:** RULA posture biomechanics demonstrate that mid-air interactions at eye or shoulder level induce acute muscular fatigue ("gorilla arm"). The optimal ergonomic low-cost interaction envelope lies in the lower-forward visual field, resting just above a tabletop surface.
- **SPECS Engineering Rule:** Position the interactive `LowerSimulationDock` at $y = -28\text{ cm}$, $z = -105\text{ cm}$. Verified via LEAF `IkBodyInteractor` that buttons are comfortably reachable by natural human arm extension.

### 5.2 Kim et al. (ACM SUI 2019)
- **Citation:** Kim, K., Erickson, A., Lambert, A., Bruder, G., & Welch, G. (2019). *Effects of Dark Mode on Visual Fatigue and Acuity in Optical See-Through Head-Mounted Displays.* *ACM SUI '19*, Article 15. [DOI: 10.1145/3357251.3357584](https://doi.org/10.1145/3357251.3357584)
- **Empirical Findings:** On additive optical waveguides (such as Snap SPECS), black pixels emit zero photons and render as completely transparent. Legibility is governed by high-luminance foreground contrast against the physical environment.
- **SPECS Engineering Rule:** Design in Additive Light-on-Translucent UI:
  - Text & Cues: Bright White (`#FFFFFF`), Cyan (`#00F0FF`), Mint Green (`#4ADE80`), Amber (`#FACC15`), Coral Red (`#FF4D4D`).
  - Never use black or dark text, and avoid large opaque background slabs that wash out the physical workpiece.

---

## 6. Multi-Agent AI Development & Industrial Safety

### 6.1 De La Torre et al. (ACM CHI 2024)
- **Citation:** De La Torre, F., Lanier, J., et al. (2024). *LLMR: Real-time Prompting of Interactive Worlds using Large Language Models.* *ACM CHI '24*, Article 307.
- **Empirical Findings:** Decomposing XR synthesis across specialized agents (Planner, Builder, Inspector) **reduced average 3D code generation errors by 4×** compared to standard unconstrained prompting.
- **SPECS Engineering Rule:** Isolate all state machine transitions and mechanical equations in a pure TypeScript module (`SequenceEngine.ts`) with zero scene dependencies, enabling deterministic verification via automated LEAF scenarios.

### 6.2 Lee et al. (ACM UIST 2025)
- **Citation:** Lee, Y., Xia, H., & Manocha, D. (2025). *Sensible Agent: A Framework for Unobtrusive Interaction with Proactive AR Agents.* *ACM UIST '25*, Article 48.
- **Empirical Findings:** Unobtrusive multimodal visual cues significantly reduced perceived intrusiveness compared to continuous voice prompts.
- **SPECS Engineering Rule:** Default to visual cues and spatial audio chimes. Do not require speech recognition for core procedural steps.

### 6.3 Industrial Safety Standard Reference: ASME PCC-1
- **Standard:** American Society of Mechanical Engineers (ASME). *ASME PCC-1: Guidelines for Pressure Boundary Bolted Flange Joint Assembly.*
- **Technical Notice:** TorqueLock AR uses illustrative demo values ($35\text{ Nm}$, $70\text{ Nm}$, $100\text{ Nm}$) and an illustrative $1.8\text{ mm}$ gasket warp coefficient ($K_{\text{warp}} = 0.0514\text{ mm/Nm}$). These values serve purely educational simulation objectives and must not be treated as certified engineering calculations for high-pressure industrial boundary assembly.
