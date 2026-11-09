# Loci Lens — Known Technical Limitations and Fallback Strategies

In accordance with hackathon guidelines, this document explicitly distinguishes between behavior verified in Lens Studio Interactive Preview and unverified physical hardware characteristics.

---

## 1. Interactive Preview Simulation vs. Physical SPECS Hardware

### A. Optical Field of View & Additive Color
- **Preview Behavior:** The simulator renders a digital vignette simulating the 37° vertical × 32° horizontal optical FOV of SPECS. Colors are composited with simulated additive transparency.
- **Physical Hardware:** SPECS utilizes optical waveguides where black (`#000000`) is 100% physically transparent, and light colors blend with ambient photons. In bright sunlight, translucent backplates may experience contrast attenuation.
- **Fallback / Mitigation:** All text elements in Loci Lens are backed by dark semi-translucent SUIK BackPlates (`#121620` at 85% opacity) and set in bright, high-luminance white (`#FFFFFF`) or cyan (`#38BDF8`).

### B. World Mesh & Spatial Persistence
- **Preview Behavior:** Lens Studio Interactive Preview simulates the room using a pre-baked 3D environment mesh and synthetic surface raycasts. Placements remain stable within the active session.
- **Physical Hardware:** On physical glasses, spatial anchors rely on continuous visual-inertial odometry (VIO) and real-time environment meshing. Rapid head movement, low texture surfaces (e.g. plain white walls), or drastic lighting shifts can cause subtle drift.
- **Fallback / Mitigation:** In preview, raycasting automatically falls back to a standardized 1.1 m focal plane stand-in if a surface hit is not detected. For physical hardware, session-based relative transform offsets ensure cards remain anchored relative to initial room poses.

### C. Hand Tracking & SIK Input
- **Preview Behavior:** Interactive Preview drives the primary hand using the mouse cursor; a left mouse click simulates an SIK pinch gesture.
- **Physical Hardware:** Optical cameras track real hand joints. Tracking can drop if hands move outside camera tracking cones or overlap with complex backgrounds.
- **Fallback / Mitigation:** Loci Lens strictly uses large, forgiving button hitboxes (minimum 12 cm × 5 cm) with generous 2 cm padding, guaranteeing that even coarse hand gestures or mouse clicks trigger smoothly.

---

## 2. Platform Scoping Decisions (Honest Exclusions)

The following capabilities are deliberately marked **Out of Scope** for the MVP demo:
1. **Live Camera Object Recognition:** The lens does not attempt to use machine learning computer vision to auto-detect a real toaster or laptop. Users select their desired loci manually.
2. **Microphone Voice Commands:** Voice input requires network NLP services that are unreliable in offline preview mode. All interactions are carried by robust SIK pinch buttons.
3. **Cross-Session Cloud Anchoring:** World anchors persist throughout the user's active session, but do not synchronize to an external cloud database across days.
4. **Multi-User Connected Lenses:** The experience is strictly single-user, centered on personal study.
