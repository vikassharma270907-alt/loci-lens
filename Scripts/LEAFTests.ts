/**
 * Loci Lens - LEAFTests
 * Lens Experience Automated Framework (LEAF) scenario definitions and test runners.
 */

import { LociManager } from "./LociManager";

export interface LEAFScenarioResult {
  scenarioName: string;
  passed: boolean;
  durationMs: number;
  assertionLog: string[];
}

export class LEAFTestRunner {
  public static async runAllScenarios(): Promise<LEAFScenarioResult[]> {
    const results: LEAFScenarioResult[] = [];

    results.push(await this.scenarioOnboardToPlace());
    results.push(await this.scenarioPlaceSixCards());
    results.push(await this.scenarioStrollProximity());
    results.push(await this.scenarioTestHiddenAnswerAndReveal());
    results.push(await this.scenarioSummaryAndRetestMissed());

    return results;
  }

  public static async scenarioOnboardToPlace(): Promise<LEAFScenarioResult> {
    const start = Date.now();
    const log: string[] = [];
    const manager = new LociManager();

    log.push(`Initial mode: ${manager.mode}`);
    const initialModeOk = manager.mode === "onboard";

    manager.startPlacement();
    log.push(`Transitioned mode: ${manager.mode}`);
    const placeModeOk = manager.mode === "place";

    return {
      scenarioName: "LEAF_Scenario_Onboard_To_Place",
      passed: initialModeOk && placeModeOk,
      durationMs: Date.now() - start,
      assertionLog: log
    };
  }

  public static async scenarioPlaceSixCards(): Promise<LEAFScenarioResult> {
    const start = Date.now();
    const log: string[] = [];
    const manager = new LociManager();
    manager.startPlacement();

    for (let i = 0; i < 6; i++) {
      const placed = manager.placeActiveCard([i * 30, 110, -150]);
      log.push(`Placed card ${i + 1}, returns completed: ${placed}`);
    }

    const countOk = manager.placedCardCount === 6;
    const hudOk = manager.hud.state.placedCount === 6;

    return {
      scenarioName: "LEAF_Scenario_Place_Six_Cards",
      passed: countOk && hudOk,
      durationMs: Date.now() - start,
      assertionLog: log
    };
  }

  public static async scenarioStrollProximity(): Promise<LEAFScenarioResult> {
    const start = Date.now();
    const log: string[] = [];
    const manager = new LociManager();
    manager.startPlacement();
    for (let i = 0; i < 6; i++) manager.placeActiveCard([i * 40, 110, -150]);

    manager.startStroll();
    const strollModeOk = manager.mode === "stroll";

    const card = manager.cardObjects[0];
    const initialVisualOk = card.visualState === "icon_only";
    card.expandPrompt();
    const expandedVisualOk = card.visualState === "prompt_expanded";

    log.push(`Stroll mode ok: ${strollModeOk}, Proximity expansion ok: ${expandedVisualOk}`);

    return {
      scenarioName: "LEAF_Scenario_Stroll_Proximity",
      passed: strollModeOk && initialVisualOk && expandedVisualOk,
      durationMs: Date.now() - start,
      assertionLog: log
    };
  }

  public static async scenarioTestHiddenAnswerAndReveal(): Promise<LEAFScenarioResult> {
    const start = Date.now();
    const log: string[] = [];
    const manager = new LociManager();
    manager.startPlacement();
    for (let i = 0; i < 6; i++) manager.placeActiveCard([i * 30, 110, -150]);

    manager.startTest();
    const active = manager.getActiveTestCard();
    const initiallyHidden = active ? !active.isAnswerRevealed : false;
    log.push(`Answer initially hidden: ${initiallyHidden}`);

    manager.revealAnswer();
    const revealedAfterPinch = active ? active.isAnswerRevealed : false;
    log.push(`Answer revealed after pinch: ${revealedAfterPinch}`);

    manager.recordTestOutcome("got_it");
    const stats = manager.getSummaryStats();
    const gotItRecorded = stats.gotItCount === 1;

    return {
      scenarioName: "LEAF_Scenario_Test_Hidden_Answer_And_Reveal",
      passed: initiallyHidden && revealedAfterPinch && gotItRecorded,
      durationMs: Date.now() - start,
      assertionLog: log
    };
  }

  public static async scenarioSummaryAndRetestMissed(): Promise<LEAFScenarioResult> {
    const start = Date.now();
    const log: string[] = [];
    const manager = new LociManager();
    manager.startPlacement();
    for (let i = 0; i < 6; i++) manager.placeActiveCard([i * 30, 110, -150]);

    manager.startTest();
    // 4 Got It, 2 Missed
    manager.revealAnswer(); manager.recordTestOutcome("got_it");
    manager.revealAnswer(); manager.recordTestOutcome("missed");
    manager.revealAnswer(); manager.recordTestOutcome("got_it");
    manager.revealAnswer(); manager.recordTestOutcome("got_it");
    manager.revealAnswer(); manager.recordTestOutcome("missed");
    manager.revealAnswer(); manager.recordTestOutcome("got_it");

    const summaryModeOk = manager.mode === "summary";
    const stats = manager.getSummaryStats();
    const accuracyOk = stats.gotItCount === 4 && stats.missedCount === 2;
    log.push(`Summary mode: ${summaryModeOk}, GotIt: ${stats.gotItCount}, Missed: ${stats.missedCount}`);

    manager.retestMissed();
    const retestModeOk = manager.mode === "test";
    const subsetCountOk = manager.testDeckSubset.length === 2;
    log.push(`Retest deck subset length: ${manager.testDeckSubset.length} (expected 2)`);

    return {
      scenarioName: "LEAF_Scenario_Summary_And_Retest_Missed",
      passed: summaryModeOk && accuracyOk && retestModeOk && subsetCountOk,
      durationMs: Date.now() - start,
      assertionLog: log
    };
  }
}
