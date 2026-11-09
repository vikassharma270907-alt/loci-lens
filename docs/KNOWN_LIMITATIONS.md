# TorqueLock AR — Known Technical Limitations and Engineering Scope

In accordance with hackathon guidelines and engineering ethics, this document explicitly distinguishes between behavior verified in the Lens Studio Interactive Preview and unverified physical hardware characteristics.

---

## 1. Simulation Nature & Safety Rules (ASME PCC-1 Compliance)

### A. Illustrative Simulation Parameters vs. Real Physics
- **Simulation Behavior:** The current release models bolt torquing across three discrete passes ($35\text{ Nm}$ Snug, $70\text{ Nm}$ Intermediate, $100\text{ Nm}$ Final Spec) and calculates an illustrative $1.8\text{ mm}$ gasket warp deflection via a fixed linear coefficient ($K_{\text{warp}} = 0.0514\text{ mm/Nm}$).
- **Real-World Reality:** Real bolted flange joints are governed by non-linear elastic fastener stretch, complex gasket compression curves, thermal expansion, surface lubrication friction factors ($K$-factor), and localized flange rotation.
- **Explicit Constraint:** TorqueLock AR is an **educational training simulation** designed to teach spatial sequence memorization. It is **NOT** a certified industrial tool and must **NEVER** be used as a substitute for certified engineering assembly procedures or **ASME PCC-1** (*Guidelines for Pressure Boundary Bolted Flange Joint Assembly*).

### B. Honest Preview Sensor Stand-Ins
- **Preview Behavior:** Because laptop development environments cannot connect to a physical Bluetooth-enabled digital torque wrench or optical fiber strain gauge, the lower-field simulation buttons (`BtnApplyTorque`, `BtnSimError`, `BtnFocusMode`) and 3D direct pinch interactions stand in for physical wrench engagement.
- **On-Screen Disclaimers:**
  - `PREVIEW STAND-IN: SIMULATED BLE TORQUE WRENCH`
  - `SIMULATION MODE — NO REAL TORQUE MEASUREMENT`
- **Fallback / Production Path:** A production industrial iteration would integrate with smart BLE torque wrenches (e.g. Atlas Copco, Sturtevant Richmont) streaming real-time torque and angle values over Bluetooth Low Energy.

---

## 2. Lens Studio Interactive Preview vs. Physical SPECS Glasses

### A. Optical Waveguide Additive Contrast
- **Preview Behavior:** The simulator composites 3D graphics on a computer monitor with simulated additive transparency over a darkened virtual background.
- **Physical Hardware:** Snap SPECS uses diffractive optical waveguides where dark pixels emit zero light (are 100% transparent), and bright pixels blend additively with real photons. In brightly lit industrial workshops, virtual text can suffer from ambient luminance washout.
- **Mitigation Applied:** In accordance with Kim et al. (ACM SUI 2019), all foreground text and indicators use high-luminance primary tokens:
  - White (`#FFFFFF`) for crisp label text
  - High-saturation Cyan (`#00F0FF`) for the active target ring
  - Mint Green (`#4ADE80`) for completed pass badges
  - Coral Red (`#FF4D4D`) for error alerts
  - Dark semi-translucent backplates (`#0F172A` at 88% opacity) provide optical isolation against ambient clutter.

### B. Spatial Anchoring & Surface Registration
- **Preview Behavior:** The virtual flange is anchored at $(0, -18, -115)\text{ cm}$ relative to the initial camera pose, simulating a workbench setup.
- **Physical Hardware:** Physical glasses utilize Visual-Inertial Odometry (VIO) and spatial meshing. If a user walks around a featureless industrial metal vessel or experiences rapid head rotation, subtle drift may occur.
- **Mitigation Applied:** The application focuses the entire working area within a compact $30\text{ cm}$ radius directly in front of the user, minimizing the need for large-scale room tracking.

### C. Hand Tracking & SIK Raycast Pinch
- **Preview Behavior:** Mouse clicks simulate SIK pinch gestures with immediate, noise-free hit detection on 3D colliders.
- **Physical Hardware:** Optical hand tracking can degrade if grease, heavy industrial work gloves, or tools occlude fingers.
- **Mitigation Applied:** Hex bolt target colliders have been expanded to generous $6.0\text{ cm}$ spherical hitboxes with $100\text{ ms}$ debounce filters, and large lower-field dock buttons ($15 \times 7.5\text{ cm}$) are provided for effortless fingertip triggering.

---

## 3. Deliberately Excluded Features (MVP Scope)

1. **Automatic Flange Machine Learning Detection:** The lens anchors the virtual flange at standard workbench height rather than running an on-device computer vision object detector.
2. **Microphone Voice Interaction:** Procedural progression is controlled entirely via direct SIK pinch and UI Kit buttons, which are robust in high-noise industrial plant environments.
3. **Real-Time Strain Gauge Telemetry:** The app does not claim to measure physical bolt tension or gasket crush.
