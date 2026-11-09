# Loci Lens — Test and Debug Instructions & Prompt

Use this guide and prompt when conducting automated and manual quality assurance in Lens Studio Interactive Preview.

---

## 1. Automated LEAF & Node.js Test Execution

### Running Node.js Test Suite
```bash
npm test
```
Expected output:
- `✓ DeckData contains 6 valid curriculum cards with all required fields`
- `✓ ReviewStore correctly handles Leitner promotions on 'Got It'`
- `✓ ReviewStore demotes missed cards to Box 1 on 'Missed'`
- `✓ LociManager transitions through Onboard -> Place -> Stroll -> Test -> Summary`
- `✓ LociManager filters missed cards correctly for retesting`
- `✓ PeripheralHUD updates accuracy percentage and progress count`
- `✓ Out-of-view directional angle calculation points toward target loci`

### Lens Studio LEAF Scenario Verifications
In Lens Studio with LEAF enabled:
1. Scenario `LociLens_Onboard_To_Place`: Simulates pinch on 'Start', verifies `activeMode === 'place'`.
2. Scenario `LociLens_Place_Six_Cards`: Simulates 6 sequential surface pinches, asserts 6 `LocusAnchor` objects instantiated, asserts `PeripheralHUD` reflects 6/6.
3. Scenario `LociLens_Test_Mode_Hidden_Answer`: Verifies card text is hidden before flip, asserts answer reveals upon card pinch.
4. Scenario `LociLens_Scoring_Summary`: Asserts 4 Got It and 2 Missed results in 66.7% accuracy on Summary plate.

---

## 2. Interactive Preview Debug Prompt

If encountering issues in Lens Studio, send this prompt to your debugging agent:

```text
Inspect the Loci Lens project in Lens Studio Interactive Preview.
Check the console logs for any errors related to:
1. SIK interaction layer or camera raycast failures.
2. CardObject transform parenting or scale anomalies.
3. ReviewStore state mutations during mode transitions.
Verify that all 5 Done Criteria in devpost/design-brief.md pass without console exceptions.
If a UI element clips outside the 37°x32° FOV, reposition it toward the 1.1 m center focus region.
```
