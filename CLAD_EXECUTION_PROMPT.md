# CLAD Execution Prompt for Loci Lens

Use this exact prompt when instructing CLAD or an AI coding agent inside a Lens Studio project with the Lens Studio MCP server connected.

---

```text
Read devpost/design-brief.md and build it for SPECS. Follow the brief closely.

Build Loci Lens, an augmented-reality memory palace Lens for Snap SPECS that associates learning cards with physical locations in the room.

Core Build Requirements:
1. Load the 6-card demo curriculum from Scripts/DeckData.ts.
2. Initialize LociManager.ts with Onboard, Place, Stroll, Test, and Summary states.
3. Build the Place mode:
   - Floating card cursor follows gaze raycast at 1.1 m depth.
   - SIK Pinch event attaches a LocusAnchor to the aimed world position.
   - PeripheralHUD updates count ring from 0/6 to 6/6.
   - AudioFx plays a soft placement chime.
4. Build the Stroll mode:
   - Walk around placed loci. Mnemonic icon is visible; proximity (<1.5 m) displays concept label.
   - Subtle directional chevron hints toward the next locus if out of the 37°x32° FOV.
5. Build the Test mode:
   - All answer plates are completely hidden.
   - User navigates to a locus and reads the question prompt.
   - SIK Pinch on the card flips it and reveals the answer.
   - User selects 'Got It' or 'Missed' buttons.
   - ReviewStore updates Leitner 3-box state.
6. Build the Summary screen:
   - Appears once all cards are tested.
   - Displays total reviewed, remembered, missed, and percentage accuracy.
   - Provides an interactive 'Review Missed' button to re-test only missed cards.

Technical & Spatial Constraints:
- Use Spectacles Interaction Kit (SIK) for pinch, dwell, and cursor hover events so they function with mouse clicks in Interactive Preview.
- Use Spectacles UI Kit (SUIK) BackPlate components with dark translucent backing (85% opacity) to ensure readability on additive displays.
- Keep interactive targets large (minimum 12 cm x 5 cm) at 1.1 m focal plane.
- Write and run LEAF tests for each done criterion, and report which pass.
```
