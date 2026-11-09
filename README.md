# Loci Lens — AR Memory Palace for Snap SPECS

[![Snap SPECS](https://img.shields.io/badge/Platform-Snap%20SPECS%20%2F%20Lens%20Studio-yellow.svg)](https://developers.specs.com/)
[![Devpost Hackathon](https://img.shields.io/badge/Devpost-Learn%20AR%20with%20SPECS-blue.svg)](https://learn-specs.devpost.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Loci Lens** transforms any physical room into an augmented-reality memory palace. By binding flashcards and learning concepts to physical furniture and environmental loci at real-world scale, learners engage spatial memory and active recall through hands-free head-worn AR on Snap SPECS.

---

## 🌟 The Experience: Place → Stroll → Test → Summary

Unlike mobile flashcard apps that trap knowledge in a 2D vertical list, **Loci Lens** roots digital concepts in physical architecture:

1. **Place Mode**: Inspect a curated 6-card learning deck. Aim at a physical surface (desk, doorway, bookshelf, chair) and pinch to pin the mnemonic card to that world locus.
2. **Stroll Mode**: Walk freely around your room. Visual markers highlight your memory path. Looking at a locus displays the mnemonic cue; approaching within reach expands the concept.
3. **Test Mode**: Active recall in action. The locus prompts the recall question while the answer remains completely occluded. The learner attempts recall, pinches to flip the card and reveal the answer, and self-evaluates with **Got It** or **Missed**.
4. **Summary Dashboard**: View session retention metrics (cards mastered vs. missed), review Leitner box assignments, and trigger targeted remediation on missed cards.

---

## 🔬 Grounded in Cognitive & AR Research

Loci Lens is engineered around empirical research in spatial cognition and head-worn AR interface design:

- **Lu et al. (IEEE VR 2020) — *Glanceable AR***: Demonstrates that peripheral, glanceable information access minimizes visual clutter and cognitive fatigue compared to central heads-up overlays. *Implemented in Loci Lens via the non-intrusive Peripheral HUD.*
- **Lu, Davari, Bowman (SUI 2021) — *Rapid Activation of Glanceable Information***: Establishes explicit user activation (e.g. pinch/dwell) to prevent unintended information display and real-world occlusion. *Implemented via explicit pinch-to-reveal answer mechanics.*
- **Krokos, Plaisant, Varshney (Virtual Reality 2019) — *Virtual Memory Palaces: Immersion Aids Recall***: Found superior recall accuracy in immersive head-tracked environments over desktop mouse-driven conditions by activating spatial vestibular and vestibular-ocular memory systems.
- **Moll & Sykes (Virtual Reality 2023) — *Optimized VR-Based Method of Loci***: Proves that structured spatial routes with minimal onboarding cognitive load enable immediate mnemonic recall benefits even for novice learners.
- **Lee et al. (UIST 2025) — *Sensible Agent***: Emphasizes unobtrusive, minimally disruptive interaction modalities over forced voice commands in AR.

---

## 🏗️ Technical Architecture & SPECS Integration

Loci Lens is architected for Snap SPECS using Lens Studio, TypeScript, the Spectacles Interaction Kit (SIK), and the Spectacles UI Kit:

```
loci-lens/
├── devpost/
│   └── design-brief.md            # Official Devpost Learn skill-pack brief (status: approved)
├── docs/
│   ├── TEST_REPORT.md             # Formal acceptance & LEAF test report
│   ├── KNOWN_LIMITATIONS.md       # Honest boundary conditions (Preview vs Hardware)
│   └── DEMO_INSTRUCTIONS.md      # Step-by-step 3-minute video recording walkthrough
├── Scripts/
│   ├── DeckData.ts                # 6-card demo deck model and schema
│   ├── LociManager.ts             # State machine (Onboard, Place, Stroll, Test, Summary)
│   ├── CardObject.ts              # 3D billboard visual card & reveal mechanics
│   ├── LocusAnchor.ts             # World surface raycast and coordinate binding
│   ├── PeripheralHUD.ts           # Peripheral progress ring (Lu et al. compliant)
│   ├── ReviewStore.ts             # Leitner 3-box spaced repetition data engine
│   ├── InputLayer.ts              # Spectacles Interaction Kit (SIK) pinch & dwell
│   ├── AudioFx.ts                 # Spatial audio chimes and out-of-view directional alerts
│   ├── LEAFTests.ts               # Automated LEAF test suites for Lens Studio
│   └── index.ts                   # Lens entry point
├── preview/
│   ├── index.html                 # Interactive Web/Canvas SPECS preview simulator
│   ├── preview-runner.js          # Interactive simulator logic (WASD, mouse-look, pinch)
│   └── styles.css                 # SPECS optical field-of-view shader simulation
├── tests/
│   └── loci-lens.test.cjs         # Node.js automated test suite (100% pass)
├── .mcp.json                      # Lens Studio MCP server bridge configuration
├── LociLens.esproj                # Lens Studio project definition
├── package.json                   # Project scripts and test harness
└── README.md
```

### Component Roles

| Component | Responsibility |
|---|---|
| **`DeckData`** | Encapsulates the 6-card learning curriculum with mnemonic iconography, question prompts, and answers. |
| **`LociManager`** | Master state machine orchestrating Phase transitions, active card tracking, and flow control. |
| **`CardObject`** | Manages 3D card visual hierarchy, additive rendering contrast, flip animations, and answer occlusion. |
| **`LocusAnchor`** | Ties virtual cards to real-world coordinates with preview raycast fallbacks. |
| **`PeripheralHUD`** | Renders progress status at the 18° peripheral margin (1.1 m focal plane), preventing central vision occlusion. |
| **`ReviewStore`** | Leitner 3-box spaced repetition store tracking correct vs. missed cards and persistence. |
| **`InputLayer`** | Binds SIK pinch gestures, cursor hover/focus states, and mouse preview inputs. |
| **`AudioFx`** | Synthesizes auditory feedback for card pinning, answer reveal, and directional out-of-view guidance. |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Lens Studio (v5.22+ or v5.23.2 recommended for CLAD MCP compatibility)
- Git

### 1. Running Automated Tests

Run the full automated test suite verifying state machines, Leitner scoring, and acceptance criteria:

```bash
npm test
```

### 2. Launching the Interactive SPECS Preview Simulator

To test the full Place → Stroll → Test → Summary experience in a simulated SPECS 37°×32° optical display environment:

```bash
npm run preview
```
Or open `preview/index.html` directly in any web browser.

**Preview Controls:**
- **WASD**: Walk through the room.
- **Mouse Drag**: Look around (360° rotational camera).
- **Primary Click**: SIK Pinch gesture (pin card, flip answer, select Got It / Missed).
- **Tab / 1-4**: Switch between modes (Onboard, Place, Stroll, Test, Summary).

### 3. Opening in Lens Studio

1. Launch **Lens Studio**.
2. Select **Open Project** and navigate to this directory.
3. Open `LociLens.esproj`.
4. In the **Interactive Preview** panel, test placing cards on virtual room geometry using the mouse-driven hand cursor.
5. In CLAD/MCP-connected environments, prompt the agent:
   > *"Read devpost/design-brief.md and build it for SPECS. Follow the brief closely. Run LEAF tests for each done criterion."*

---

## 🎬 3-Minute Demo Video Walkthrough

The demo video follows the exact judging criteria flow:
1. **0:00 - 0:25**: Introduction to the Problem (rote 2D flashcards fail spatial cognition).
2. **0:25 - 0:45**: Planning with Devpost Learn Skill Pack (`devpost/design-brief.md`).
3. **0:45 - 1:20**: **Place Mode** — Pinning 6 cards to physical room locations with peripheral HUD updates.
4. **1:20 - 1:50**: **Stroll Mode** — Navigating the room, revealing mnemonic cues on approach.
5. **1:50 - 2:25**: **Test Mode** — Active recall, answer reveal on pinch, self-grading (Got It / Missed).
6. **2:25 - 2:45**: **Summary Screen** — Retention metrics, Leitner box assignments, reviewing missed cards.
7. **2:45 - 3:00**: Key takeaways and closing.

---

## 📋 Hackathon Submission Compliance Checklist

- [x] **New Project**: Built specifically for the Learn AR with SPECS Hackathon.
- [x] **Devpost Skill Pack Planning**: Official design brief generated at `devpost/design-brief.md` via `plan-lens`.
- [x] **SPECS Architecture**: Built with SIK and Spectacles UI Kit principles.
- [x] **Interactive Preview Verifiable**: Operates reliably in Lens Studio Interactive Preview with zero external hardware prerequisites.
- [x] **Honest Disclosure**: Clear distinction between simulated preview validation and physical see-through hardware behavior.

---

## 📄 License

MIT License. Developed for the Devpost Learn AR with SPECS Hackathon.
