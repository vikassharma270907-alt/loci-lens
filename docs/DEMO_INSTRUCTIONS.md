# TorqueLock AR — 2:30 Video Demonstration Script & Pitch Guide

This document provides the exact second-by-second recording script for the Devpost hackathon video submission.

Target Duration: **2 minutes 30 seconds** (Strictly within the 3-minute hackathon limit).

---

## Technical Recording Setup

1. **Resolution:** 1920 × 1080 (16:9 Full HD).
2. **Audio:** Clear microphone commentary with system audio capturing spatial feedback tones (`AudioSynthesizer`).
3. **Capture Target:** Snap SPECS Interactive Preview window (or full IDE showing CLAD and LEAF Logger panel).
4. **Disclaimers Visible:** Ensure on-screen disclaimer (`PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH` and `SIMULATION MODE — NO REAL TORQUE MEASUREMENT`) is clearly visible.

---

## Second-by-Second Video Script

| Timecode | Visual on Screen | Voiceover Narration |
|---|---|---|
| **0:00 – 0:20** | **Product Introduction & The Problem**<br>Camera orbits down onto the 1:1 scale six-bolt industrial flange at $(0, -18, -115)\text{ cm}$. Trainee stands over symmetrical bolt circle. | *"Tightening a high-pressure pipe flange requires tightening bolts in a precise cross pattern across three torque passes. But on a symmetrical circular flange, checking a phone screen or paper chart forces you to take your hands off the torque wrench and your eyes off the workpiece—leading to skipped bolts and dangerous leaks. Welcome to TorqueLock AR—a spatial memory and procedural training coach built for Snap SPECS."* |
| **0:20 – 0:50** | **Stage A: Learn Mode (Method of Loci Spatial Encoding)**<br>User navigates Learn Mode. Bolt 1 glows cyan with floating mnemonic card: *"Bolt 1: Initial Anchor — Top Origin"*. User advances: active ring crosses directly through center to Bolt 4 at 6 o'clock (*"Direct Polar Opposite — Equalize centerline load"*), then rotates to Bolt 2, 5, 3, 6. | *"Instead of placing flashcards in an unrelated room, TorqueLock AR turns the symmetrical flange itself into the spatial memory palace. In Learn Mode, trainees associate each of the six bolt positions with memorable spatial roles: starting at the 12 o'clock anchor, crossing directly through the center to equalize polar load, and locking down each diagonal axis in star sequence."* |
| **0:50 – 1:20** | **Stage B: Recall Mode (Active Spatial Memory Retrieval)**<br>Sequence cues vanish. Prompt appears: *"Which bolt comes next?"* User clicks Bolt 1 (correct chime, advances to step 2). Then user intentionally clicks adjacent Bolt 2 instead of Bolt 4 (coral alert triggers: *"Incorrect. Expected Bolt 4. Try again."*). User selects Bolt 4 (correct chime). | *"In Recall Mode, all visible numbers disappear. Trainees must retrieve the cross sequence from spatial memory. A correct pinch provides instant affirmative confirmation. If you select the wrong fastener, the lens immediately corrects you without disrupting the physical task flow, logging missed steps for targeted review."* |
| **1:20 – 1:55** | **Stage C: Practice Mode (Procedural Simulation & Focus Mode)**<br>3D Flange practice begins with active target ring hugging Bolt 1 at 35 Nm Snug. User clicks `BtnFocusMode`—the 2-line specification tag collapses into a compact 1-line eyes-up pill (`P1 · B1 · 35 Nm`). User clicks `BtnSimError`—gasket plane turns coral red, audio alarm sounds, and peripheral banner warns `!! SEQUENCE ERROR: UNDO BOLT 2 (-35 Nm) !!`. User clicks Apply to relieve error and resumes nominal star tightening. | *"In Practice Mode, trainees execute the procedure with a 1:1 cyan target ring. Grounded in research by Henderson & Feiner and Lindlbauer et al., Focus Mode automatically collapses detailed instructions during tool engagement so your line of sight stays clear. If you torque an out-of-sequence bolt, the gasket plane flashes coral red, warning you of an uneven crush hazard before joint integrity is compromised."* |
| **1:55 – 2:15** | **Stage D: Summary & Spaced Repetition**<br>Completing Pass 3 (100 Nm) triggers the green completion seal: `FLANGE SEALED · 100 Nm · 0.0 mm WARP`. Experience auto-transitions to Summary screen showing recall accuracy (83%), missed bolt positions (Bolt 4), and Leitner 3-box review recommendations. | *"Upon completing Pass 3 at 100 Nm, the flange is certified sealed with zero warp. The Summary screen breaks down your retrieval accuracy, identifies exact missed bolt positions, and schedules targeted spaced repetition to guarantee procedural mastery before entering the plant floor."* |
| **2:15 – 2:30** | **Technical Proof & Automated LEAF Verification**<br>User clicks `Run LEAF (C1–C6)` in the interactive preview panel. Live console runs all 6 automated scenarios and displays: `LEAF TEST RESULT: 6 / 6 SCENARIOS PASSED (100% OK)`. Closing slide with GitHub repository link. | *"TorqueLock AR is built with a pure TypeScript sequence engine, Spectacles Interaction Kit pinch physics, and 100% automated LEAF scenario verification. Embodying the true strengths of AR glasses—drawing in the world, leaving hands free, and keeping interfaces glanceable. Thank you."* |
