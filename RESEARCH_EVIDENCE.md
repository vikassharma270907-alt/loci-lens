# Loci Lens — Academic Research Evidence & Design Implications

This document consolidates the cognitive science and human-computer interaction (HCI) research informing the product design and technical architecture of Loci Lens.

---

## 1. Glanceable Information Architecture in Head-Worn AR

### Key Paper
**Lu, F., Davari, S., Lisle, L., Li, Y., & Bowman, D. A. (2020).**  
*Glanceable AR: Evaluating Information Access Methods for Head-Worn Augmented Reality.*  
IEEE Conference on Virtual Reality and 3D User Interfaces (VR), 930–939.  
DOI: [10.1109/VR46266.2020.00113](https://doi.org/10.1109/VR46266.2020.00113)

### Empirical Findings
- Evaluated methods for presenting secondary information in head-worn AR without obstructing primary visual tasks.
- Found that **eye-glance and head-glance access modes** resulted in significantly lower cognitive workload, reduced task completion time, and higher subjective user preference compared to gaze-summoned central modals.
- Central visual clutter degraded user awareness and caused visual fatigue.

### Direct Design Implications for Loci Lens
- **Peripheral HUD Placement**: The progress indicator (card count, session metrics) is anchored in the lower-right peripheral margin (18° off optical center, 1.1 m focal plane), never occupying central vision.
- **Glanceable Status**: During active recall, the HUD dims to 30% opacity, ensuring total cognitive focus on the memory locus.

---

## 2. Intentional Activation and Occlusion Management

### Key Paper
**Lu, F., Davari, S., & Bowman, D. A. (2021).**  
*Exploration of Techniques for Rapid Activation of Glanceable Information in Head-Worn Augmented Reality.*  
ACM Symposium on Spatial User Interaction (SUI '21), Article 6, 1–11.  
DOI: [10.1145/3485279.3485286](https://doi.org/10.1145/3485279.3485286)

### Empirical Findings
- Explored interaction techniques (Fixation, Head-Depth, Hand-Overlay, Dwell, Pinch) for activating peripheral content while walking and sitting.
- Found that secondary information must remain unobtrusive and non-occluding until an explicit, intentional user action occurs.
- Passive or accidental activation of virtual content severely disrupts real-world tasks and causes disorientation.

### Direct Design Implications for Loci Lens
- **Occluded Answer Mechanics**: Answers are never visible upon simply looking at a card.
- **Intentional Pinch-to-Reveal**: An explicit SIK pinch gesture is strictly required to flip the card and expose the answer, enforcing active recall and preventing accidental exposure.

---

## 3. Immersion and Spatial Anchoring in Memory Palaces

### Key Paper
**Krokos, E., Plaisant, C., & Varshney, A. (2019).**  
*Virtual memory palaces: immersion aids recall.*  
Virtual Reality, 23(1), 1–15.  
DOI: [10.1007/s10055-018-0346-3](https://doi.org/10.1007/s10055-018-0346-3)

### Empirical Findings
- Controlled study (N=40) comparing memory recall of face-location pairings in a head-tracked immersive display versus a traditional desktop mouse-and-screen interface.
- Participants in the head-mounted display condition exhibited superior recall accuracy (8.8% average improvement) and substantially higher confidence.
- Attributed the gain to **vestibular-ocular and spatial proprioception**: moving the head and body in space activates spatial cognitive structures in the hippocampus and parietal cortex.

### Direct Design Implications for Loci Lens
- **World Grounding over Screen Lists**: Cards are anchored to 3D world coordinates on furniture and physical boundaries rather than floating in a fixed head-locked viewport.
- **Bodily Movement**: Navigating the physical space acts as an indexing structure for memory retrieval.

---

## 4. Rapid Scaffolding of the Method of Loci

### Key Paper
**Moll, B., & Sykes, E. (2023).**  
*Optimized virtual reality-based Method of Loci memorization techniques through increased immersion and effective memory palace designs: a feasibility study.*  
Virtual Reality, 27(2), 941–966.  
DOI: [10.1007/s10055-022-00700-z](https://doi.org/10.1007/s10055-022-00700-z)

### Empirical Findings
- Demonstrated that a structured virtual memory palace design allows novice users to leverage the Method of Loci without days of prior mnemonic training.
- Reported significant gains in non-spatial information recall across successive trials when routes were clearly structured and landmarks were visually distinct.

### Direct Design Implications for Loci Lens
- **Pre-Structured 6-Card Curriculum**: Eliminates the cognitive burden of inventing abstract mnemonics from scratch; each card provides a vivid visual icon and suggested locus.
- **Sequential Route Cues**: Out-of-view directional chimes and boundary chevrons guide the learner through a logical spatial circuit.

---

## 5. Unobtrusive Proactive AR Agents

### Key Paper
**Lee, G., Xia, C., & Manocha, D. (2025).**  
*Sensible Agent: A Framework for Unobtrusive Interaction with Proactive AR Agents.*  
ACM Symposium on User Interface Software and Technology (UIST '25).  
DOI: [10.1145/3746059.3747748](https://doi.org/10.1145/3746059.3747748)

### Empirical Findings
- Addressed user annoyance and perceived intrusiveness from proactive AR assistants.
- Demonstrated that multimodal visual-spatial cues and subtle audio notifications yield significantly higher user acceptance than intrusive voice prompts or conversational interruptions.

### Direct Design Implications for Loci Lens
- **Hands-Free and Voice-Free**: Interaction relies exclusively on visual affordances, high-contrast SIK pinch targets, and subtle audio chimes, respecting user attention and social acceptability.

---

## 6. Closed-Loop Agentic AR Construction

### Key Paper
**De La Torre, F., et al. (2024).**  
*LLMR: Real-time Prompting of Interactive Worlds using Large Language Models.*  
ACM CHI Conference on Human Factors in Computing Systems (CHI '24).  
DOI: [10.1145/3613904.3642464](https://doi.org/10.1145/3613904.3642464)

### Empirical Findings
- Demonstrated that LLM-driven mixed reality authoring achieves a 4x reduction in scene errors when employing closed-loop scene graph inspection, automated unit verification, and iterative self-debugging.

### Direct Design Implications for Loci Lens
- **CLAD & LEAF Synergy**: Validates Snap's closed-loop architecture where AI agents iteratively query scene state, run LEAF automated tests, and resolve compilation and layout issues.
