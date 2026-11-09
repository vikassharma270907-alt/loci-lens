/**
 * Loci Lens - DeckData
 * Encapsulates the 6-card multi-disciplinary demo curriculum with mnemonic iconography,
 * prompt questions, answers, and suggested spatial loci.
 */

export interface LearningCard {
  id: string;
  order: number;
  topic: string;
  question: string;
  answer: string;
  mnemonicCue: string;
  iconName: string;
  suggestedLocus: string;
}

export const DEMO_DECK: LearningCard[] = [
  {
    id: "card_1",
    order: 1,
    topic: "Biology",
    question: "What is the primary light-absorbing pigment in photosynthesis?",
    answer: "Chlorophyll-a (absorbs blue-violet & red wavelengths; reflects green)",
    mnemonicCue: "Luminous Emerald Leaf",
    iconName: "leaf_icon",
    suggestedLocus: "Study Desk Lamp"
  },
  {
    id: "card_2",
    order: 2,
    topic: "Physics",
    question: "What fundamental physical constant relates a photon's energy to its frequency?",
    answer: "Planck's Constant (h ≈ 6.626 × 10⁻³⁴ J·s)",
    mnemonicCue: "Vibrant Quantum Spark",
    iconName: "spark_icon",
    suggestedLocus: "Power Outlet / Charger"
  },
  {
    id: "card_3",
    order: 3,
    topic: "History",
    question: "In what year did the Roman Senate confer the honorific title 'Augustus'?",
    answer: "27 BCE (signaling the transition from Roman Republic to Empire)",
    mnemonicCue: "Golden Laurel Wreath",
    iconName: "laurel_icon",
    suggestedLocus: "Main Room Doorway"
  },
  {
    id: "card_4",
    order: 4,
    topic: "Astronomy",
    question: "Which Martian shield volcano is the tallest known mountain in the solar system?",
    answer: "Olympus Mons (standing approx. 21.9 km above Martian datum)",
    mnemonicCue: "Crimson Planet Eye",
    iconName: "mars_icon",
    suggestedLocus: "Tall Bookshelf"
  },
  {
    id: "card_5",
    order: 5,
    topic: "Chemistry",
    question: "What aromatic hydrocarbon possesses an exceptionally stable delocalized pi-electron ring?",
    answer: "Benzene (C₆H₆, characterized by planar hexagonal symmetry)",
    mnemonicCue: "Molecular Hexagon Ring",
    iconName: "hexagon_icon",
    suggestedLocus: "Center Coffee Table"
  },
  {
    id: "card_6",
    order: 6,
    topic: "Computer Science",
    question: "What self-balancing binary search tree maintains a height difference factor ≤ 1?",
    answer: "AVL Tree (Adelson-Velsky and Landis tree, guaranteeing O(log n) operations)",
    mnemonicCue: "Balanced Binary Tree",
    iconName: "tree_icon",
    suggestedLocus: "Window Sill"
  }
];

export function getCardById(id: string): LearningCard | undefined {
  return DEMO_DECK.find((c) => c.id === id);
}

export function getTotalCardsCount(): number {
  return DEMO_DECK.length;
}
