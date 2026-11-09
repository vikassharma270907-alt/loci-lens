# TorqueLock AR — Demo and Submission Guide

This document provides the official submission text, YouTube metadata, elevator pitch, and presentation outline for **TorqueLock AR** for the Devpost Learn AR with SPECS Hackathon.

---

## 1. Devpost Submission Metadata

### Project Title
**TorqueLock AR — Spatial Memory & Procedural Flange Torquing**

### Elevator Pitch (139 Characters)
*TorqueLock AR transforms the 6-bolt flange into a spatial memory palace on Snap SPECS, training procedural star-pattern torquing hands-free.*

### Category / Track
- Educational & Spatial Memory
- Enterprise & Industrial Training

### Built With
- Snap SPECS 27
- Lens Studio 5.23 / 5.24
- Spectacles Interaction Kit (SIK)
- TypeScript
- Web Audio API
- Node.js & LEAF Testing Framework
- Closed-Loop Agentic Development (CLAD)

---

## 2. YouTube Metadata

### Video Title
**TorqueLock AR — Spatial Memory Palace on Snap SPECS (Devpost Learn AR Hackathon)**

### Video Description
```
TorqueLock AR transforms the industrial six-bolt flange into an augmented reality spatial memory palace for Snap SPECS glasses.

Improper flange bolt tightening is a leading cause of catastrophic gasket blowouts, fluid leaks, and costly plant downtime in chemical and power piping systems. While ASME PCC-1 mandates a strict cross-pattern star sequence (1 -> 4 -> 2 -> 5 -> 3 -> 6) across three progressive torque passes (35 Nm -> 70 Nm -> 100 Nm), symmetrical circular flanges lack natural visual landmarks, causing technicians to lose their orientation.

TorqueLock AR grounds the ancient Method of Loci directly on the physical workpiece:
1. LEARN: Encodes the star sequence across 6 fastener loci using high-luminance cyan spatial beacons.
2. RECALL: Removes visual crutches to enforce active cognitive retrieval via SIK pinch.
3. PRACTISE: Progressive torque ramp simulation featuring cognitive Focus Mode (Henderson & Feiner / Lindlbauer et al.) and real-time Gasket Warp Detection (1.8mm deflection warning).
4. SUMMARY: Displays session metrics and routes missed bolts into a Leitner 3-box spaced repetition system for targeted remediation.

Grounded in 14 peer-reviewed HCI papers and verified with 100% automated test pass rate (27/27 passing across 6-bolt and 5-bolt suites).

GitHub Repository: https://github.com/vikassharma270907-alt/loci-lens
Interactive Optical Preview: Run `npm run preview` -> http://localhost:8080/

#SnapSPECS #LensStudio #AugmentedReality #Devpost #ASME #SpatialComputing #MethodOfLoci
```

### Video Tags
`Snap SPECS`, `Lens Studio`, `Augmented Reality`, `Devpost`, `TorqueLock`, `Method of Loci`, `Spatial Memory`, `ASME PCC-1`, `SIK`, `Interactive Preview`, `Industrial AR`, `Smart Glasses`

---

## 3. Demo Video Outline (Duration: 2m 22s)

- **0:00 - 0:24 (The Industrial Problem & Flange as Palace):** Symmetrical circular flanges lack spatial landmarks. Technicians lose orientation switching between 2D charts and physical workpieces. TorqueLock AR turns the 6-bolt flange itself into the memory palace.
- **0:24 - 0:47 (Skill Pack & 14 HCI Research Papers):** Grounded in Krokos et al., Henderson & Feiner, Lindlbauer et al., and Kim et al. Demonstrates Cognitive Focus Mode Level-of-Detail (LOD).
- **0:47 - 0:68 (Phase 1: Learn Mode):** Step-by-step encoding of the 6 loci in ASME PCC-1 star sequence ($1 \rightarrow 4 \rightarrow 2 \rightarrow 5 \rightarrow 3 \rightarrow 6$).
- **1:08 - 1:25 (Phase 2: Recall Mode):** Visual lines removed. Active retrieval prompt. Technician pinches the active bolt to confirm selection.
- **1:26 - 1:52 (Phase 3: Practise Mode & Warp Warning):** ASME PCC-1 multi-pass torque ramp ($35 \rightarrow 70 \rightarrow 100\text{ Nm}$). Focus Mode pill (`P1 · B1 · 35 Nm`). Error demo: improper adjacent tightening triggers 1.8mm gasket warp alert and audio buzzer.
- **1:52 - 2:06 (Phase 4: Summary Mode):** 94.4% tightening accuracy, pass efficiency, Leitner 3-box spaced repetition, and instant Box 1 remediation.
- **2:06 - 2:22 (Technical Verification & Closing):** Decoupled TypeScript engine, 20/20 automated tests passing, transparent educational simulation disclaimer.

---

## 4. Key Assets Checklist

- [x] **Video:** `torquelock_ar_demo_walkthrough.mp4` (1920x1080 @ 24fps, 2m 22s, H.264/AAC, ~4.1 MB)
- [x] **Captions:** `torquelock_demo_captions.srt` & `torquelock_demo_captions.vtt`
- [x] **Thumbnail:** `torquelock_ar_youtube_thumbnail.png` (1280x720 PNG)
- [x] **Devpost Submission Text:** `devpost/submission.md`
- [x] **Design Brief:** `devpost/design-brief.md`
- [x] **Academic Evidence:** `RESEARCH_EVIDENCE.md`
- [x] **Sources & Standards:** `SOURCE_NOTES.md`
- [x] **Automated Tests:** `npm test` (20/20 passing)
- [x] **Interactive Optical Preview:** `npm run preview` -> `http://localhost:8080/`
