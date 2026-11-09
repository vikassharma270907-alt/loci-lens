/**
 * LeafIndex.ts
 * Registers all 6 CrossTorque AR LEAF scenarios for discovery in the Lens Studio LEAF panel
 * and execution via CLAD /specs-leaf-run-in-preview.
 */

import { scenariosIndex } from "Leaf.lspkg/Scenarios/decorator/ScenarioIndexDecorator";
import { ScenarioMetadata } from "Leaf.lspkg/Scenarios/scenario/ScenarioMetadata";
import {
  C1InitialLayoutScenario,
  C2StarProgressionScenario,
  C3AdjacentErrorRejectionScenario,
  C4FocusAndEdgeArrowScenario,
  C5FullCompletionAndResetScenario,
  C6ErgonomicReachGuardScenario,
} from "./CrossTorqueLeafScenarios";

@component
export class LeafIndex extends BaseScriptComponent {
  public static getTypeName(): string {
    return "LeafIndex";
  }

  @scenariosIndex
  static scenariosIndex: ScenarioMetadata[] = [
    {
      id: "c1_initial_layout",
      typename: C1InitialLayoutScenario.getTypeName(),
    },
    {
      id: "c2_star_progression",
      typename: C2StarProgressionScenario.getTypeName(),
    },
    {
      id: "c3_adjacent_error_rejection",
      typename: C3AdjacentErrorRejectionScenario.getTypeName(),
    },
    {
      id: "c4_focus_and_edge_arrow",
      typename: C4FocusAndEdgeArrowScenario.getTypeName(),
    },
    {
      id: "c5_full_completion_and_reset",
      typename: C5FullCompletionAndResetScenario.getTypeName(),
    },
    {
      id: "c6_ergonomic_reach_guard",
      typename: C6ErgonomicReachGuardScenario.getTypeName(),
    },
  ];
}
