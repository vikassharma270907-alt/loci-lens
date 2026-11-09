---
status: approved
---

# Design brief: Loci Lens

<!-- Filled in by plan-lens from the learner's interview. Generated for the Learn AR with SPECS Devpost Hackathon. -->

## The one spatial moment
The user stands in their room, looks across toward a desk or shelf, sees a subtle luminous locus anchor, and performs a natural pinch gesture to reveal an associated learning card whose answer was mentally and spatially bound to that physical spot.

## Why it belongs on glasses
- Uses: draws in the world, leaves your body free, shares your view
- Why it's better than the phone or laptop version: A phone or laptop forces the learner to review flashcards on an isolated, flat 2D viewport, severing information from environmental embodiment. Loci Lens implements the ancient Method of Loci directly on head-worn AR: cards anchor to real physical geometry at 1:1 scale, freeing both hands and eyes to walk, orient, and encode recall pathways through bodily movement.

## Product or overlay
- Type: overlay: it maps and binds digital mnemonic anchors onto physical surfaces and furniture in the user's room.
- What the real version would sense: physical surfaces, room geometry, world mesh.
- Stand-in for the preview: simulated world mesh and virtual surface placement raycast at 1.1 m focal depth; mouse look and WASD movement stand in for head motion, while primary click acts as SIK pinch.

## Where things live
- Where the user is looking during the main task: looking forward and 10° to 15° below eye level toward physical furniture or room anchors (0.8 m to 2.0 m distance).
- CardObject (Learning Card): sits anchored in 3D world space at the chosen locus, roughly 1.1 m distance, approximately 32 cm wide by 22 cm high, facing the user with a 15° upward tilt.
- PeripheralHUD: anchored in the lower-right peripheral display margin (approx. 18° off optical center, 1.1 m virtual focal plane), measuring 10 cm in diameter so central vision remains unobstructed.
- Out-of-view direction cue: subtle directional chevron (3 cm) rendered at the display viewport perimeter pointing toward the next scheduled locus with a soft spatial chime.

## Hands and input
- Pinch to pin: aims at target surface and places the currently selected card at that world coordinate.
- Pinch to reveal: tapping or pinching an active card in Test mode flips the card to uncover the hidden answer.
- Pinch Got It / Missed: big 14 cm x 5 cm buttons below the revealed answer plate to categorize recall.
- Targets are big and highlight when aimed at (SIK cursor focus state with high-contrast glowing border).
- Voice (if any) and the button that does the same job: voice input is out of scope for MVP; high-contrast SIK pinch buttons carry all interactions reliably in preview and on device.

## When things show
- Onboarding card: shows on initial launch at 1.1 m directly ahead; dismisses on pinch "Start".
- Placed Cards: in Stroll and Test modes, only the minimalist mnemonic locus icon (8 cm) is visible; card details and question text expand upon gaze/cursor proximity (<1.5 m); answer reveals exclusively on explicit pinch.
- PeripheralHUD: persists unobtrusively in the periphery, fading to 30% opacity during active card recall to eliminate distraction.
- Summary screen: appears automatically once all 6 cards are reviewed, detailing accuracy, retention rate, and missed items.
- If something needs attention out of view: soft spatial audio chime and directional border chevron pointing toward the target locus.

## Done criteria
Each one can be checked in Lens Studio's preview.
1. Lens launches in Lens Studio Interactive Preview, presents clear 1-step onboarding, and loads the 6-card demo deck.
2. User can target a surface in the simulated environment, pinch to pin each card, and observe the Peripheral HUD update count (e.g. 1/6 through 6/6) with placement confirmation audio/visual pulse.
3. User can switch to Test mode where question prompts are displayed at loci while answers remain completely occluded until an explicit pinch event.
4. User can mark cards as "Got It" or "Missed", updating the Leitner review store state and triggering immediate visual feedback.
5. Reviewing all cards opens the Summary dashboard displaying total reviewed, remembered count, missed count, and an interactive "Review Missed" action.

## Out of scope
- Real-time camera computer vision object recognition (e.g. automatically recognizing a physical kettle or laptop).
- Speech recognition and microphone voice commands.
- Multi-user shared session synchronization (Connected Lenses).
- Persistent cross-session cloud anchor database.

## Risks and open questions
- Real-world surface persistence across app restarts (mitigated by session-based coordinate anchoring and predictable preview test stand-in).
- Additive display contrast in high-ambient lighting (mitigated by high-contrast dark backplates behind all text and bright typographic tokens).

## Build notes for CLAD
- Build for SPECS so it runs and can be demonstrated in Lens Studio's preview. No SPECS device is available.
- Use Spectacles Interaction Kit (SIK) and UI Kit for all interactions, so they work with the mouse in Interactive Preview and with LEAF.
- Build any stand-in exactly as described above, and keep it obvious in the scene.
- Use real-world scale in centimeters. Keep content inside the user's view during the main task.
- The display is additive: black renders as transparent. Don't rely on black or very dark content to be seen; keep text light and readable from where the user stands.
- Get the basic flow working first, then add detail.
- Write LEAF scenarios for each done criterion, run them in preview, and report which pass. Say which criteria have no test.
- Don't record, identify, or follow people.

## After the build: judge it
This part is for you, after CLAD finishes.

1. **Does it work?** Ask your agent which LEAF tests passed and which done criteria have no test.
2. **Walk around it.** Open the preview in Interactive Preview. Use WASD to move, Q and E to go down and up, and right-drag (or hold Shift) to look around. Clicking acts as a pinch. Stand where a user would and look at the task.
3. **Ask the three questions.**
   - Does it use what I'm looking at?
   - Does it put something in my space, where it belongs?
   - Does it free my hands or let me keep my eyes up?
   - Would it be just as good on a phone? If so, what would make it need the glasses?
4. **Check comfort.**
   - Everything I need is in view while I do the task. Nothing sits at the edges, behind me, or stuck to my face.
   - Every control is within reach of someone standing there.
   - Text reads easily from where I stand. No dark UI disappearing.
   - Things show when needed and get out of the way.
5. **Label what you know.** Write "logic proven" next to anything the tests and preview show working, and "feel unproven" next to anything only real glasses could tell you (comfort over time, real hand tracking, real recognition).
6. **Fix with design notes, not code.** Tell your agent what to change in design terms, for example: "Move the step card 15 cm lower and next to the pan. Make the Next button twice as big. Re-run the tests." If a fix takes under a minute, like nudging a panel, do it yourself in the scene.
7. **Submit.** Record a video under 3 minutes of your Lens in the preview, public on YouTube. Make your repo public with your Lens Studio project and this `devpost/` folder. Details are on the hackathon site: https://learn-specs.devpost.com/resources
