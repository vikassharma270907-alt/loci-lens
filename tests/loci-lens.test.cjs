const test = require("node:test");
const assert = require("node:assert/strict");

// --- In-Memory Models Matching TypeScript Definitions ---

const DEMO_DECK = [
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

class ReviewStore {
  constructor(cards = DEMO_DECK) {
    this.records = new Map();
    this.initialize(cards);
  }

  initialize(cards) {
    this.records.clear();
    cards.forEach((c) => {
      this.records.set(c.id, {
        cardId: c.id,
        box: 1,
        correctCount: 0,
        missedCount: 0,
        lastOutcome: "untested"
      });
    });
  }

  recordResult(cardId, outcome) {
    const record = this.records.get(cardId);
    if (!record) throw new Error("Card not found");

    if (outcome === "got_it") {
      record.box = Math.min(3, record.box + 1);
      record.correctCount += 1;
    } else {
      record.box = 1;
      record.missedCount += 1;
    }
    record.lastOutcome = outcome;
    record.lastReviewedAt = Date.now();
    return record;
  }

  getMissedCards() {
    return Array.from(this.records.values())
      .filter((r) => r.lastOutcome === "missed")
      .map((r) => r.cardId);
  }

  getStats() {
    const records = Array.from(this.records.values());
    let tested = 0;
    let gotIt = 0;
    let missed = 0;
    for (const r of records) {
      if (r.lastOutcome !== "untested") tested++;
      if (r.lastOutcome === "got_it") gotIt++;
      if (r.lastOutcome === "missed") missed++;
    }
    const accuracy = tested > 0 ? Math.round((gotIt / tested) * 1000) / 10 : 0;
    return {
      totalCards: records.length,
      testedCount: tested,
      gotItCount: gotIt,
      missedCount: missed,
      accuracyPercentage: accuracy
    };
  }

  resetTestedState() {
    for (const r of this.records.values()) {
      r.lastOutcome = "untested";
    }
  }
}

class LocusAnchor {
  constructor(cardId, pos = [0, 110, -150]) {
    this.cardId = cardId;
    this.position = [...pos];
    this.isAnchored = false;
  }

  bind(pos) {
    this.position = [...pos];
    this.isAnchored = true;
  }

  getDistanceTo(viewerPos) {
    const dx = this.position[0] - viewerPos[0];
    const dy = this.position[1] - viewerPos[1];
    const dz = this.position[2] - viewerPos[2];
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  getBearingFrom(viewerPos, viewerForward) {
    const toX = this.position[0] - viewerPos[0];
    const toZ = this.position[2] - viewerPos[2];
    const targetAngle = Math.atan2(toX, toZ);
    const forwardAngle = Math.atan2(viewerForward[0], viewerForward[2]);
    let diff = targetAngle - forwardAngle;
    while (diff > Math.PI) diff -= 2 * Math.PI;
    while (diff < -Math.PI) diff += 2 * Math.PI;
    return diff;
  }
}

class PeripheralHUD {
  constructor(totalCards = 6) {
    this.mode = "Onboard";
    this.totalCards = totalCards;
    this.placedCount = 0;
    this.testedCount = 0;
    this.rememberedCount = 0;
    this.accuracy = 0;
    this.outOfViewDeg = null;
  }

  update(placed, tested, remembered) {
    this.placedCount = placed;
    this.testedCount = tested;
    this.rememberedCount = remembered;
    this.accuracy = tested > 0 ? Math.round((remembered / tested) * 1000) / 10 : 0;
  }

  evaluateDirection(bearingRad) {
    const halfFovRad = (32 / 2) * (Math.PI / 180);
    if (Math.abs(bearingRad) > halfFovRad) {
      this.outOfViewDeg = (bearingRad * 180) / Math.PI;
    } else {
      this.outOfViewDeg = null;
    }
  }
}

class CardObject {
  constructor(card) {
    this.card = card;
    this.anchor = new LocusAnchor(card.id);
    this.visualState = "icon_only";
    this.isAnswerRevealed = false;
    this.lastResult = null;
  }

  reveal() {
    this.isAnswerRevealed = true;
    this.visualState = "answer_revealed";
  }

  mark(outcome) {
    this.lastResult = outcome;
  }
}

class LociManager {
  constructor(cards = DEMO_DECK) {
    this.cards = cards;
    this.mode = "onboard";
    this.reviewStore = new ReviewStore(cards);
    this.hud = new PeripheralHUD(cards.length);
    this.cardObjects = cards.map((c) => new CardObject(c));
    this.placedCount = 0;
    this.activeCardIndex = 0;
    this.activeTestIndex = 0;
    this.testSubset = [];
  }

  startPlacement() {
    this.mode = "place";
    this.hud.mode = "Place";
    this.activeCardIndex = 0;
    this.placedCount = 0;
  }

  placeCard(pos) {
    if (this.mode !== "place" || this.activeCardIndex >= this.cardObjects.length) return false;
    const card = this.cardObjects[this.activeCardIndex];
    card.anchor.bind(pos);
    this.placedCount++;
    this.activeCardIndex++;
    this.hud.update(this.placedCount, 0, 0);
    return true;
  }

  startTest(onlyMissed = false) {
    this.mode = "test";
    this.hud.mode = "Test";
    if (onlyMissed) {
      const missed = new Set(this.reviewStore.getMissedCards());
      this.testSubset = this.cardObjects.filter((c) => missed.has(c.card.id));
    } else {
      this.testSubset = [...this.cardObjects];
      this.reviewStore.resetTestedState();
    }
    this.activeTestIndex = 0;
  }

  getActiveTestCard() {
    if (this.mode !== "test" || this.activeTestIndex >= this.testSubset.length) return null;
    return this.testSubset[this.activeTestIndex];
  }

  revealAnswer() {
    const card = this.getActiveTestCard();
    if (!card) return false;
    card.reveal();
    return true;
  }

  recordOutcome(outcome) {
    const card = this.getActiveTestCard();
    if (!card) return false;
    this.reviewStore.recordResult(card.card.id, outcome);
    card.mark(outcome);
    this.activeTestIndex++;
    const stats = this.reviewStore.getStats();
    this.hud.update(this.placedCount, stats.testedCount, stats.gotItCount);

    if (this.activeTestIndex >= this.testSubset.length) {
      this.mode = "summary";
      this.hud.mode = "Summary";
    }
    return true;
  }

  retestMissed() {
    const missed = this.reviewStore.getMissedCards();
    if (missed.length === 0) return false;
    this.startTest(true);
    return true;
  }
}

// --- Test Suites ---

test("DeckData contains 6 valid curriculum cards with all required fields", () => {
  assert.equal(DEMO_DECK.length, 6);
  const ids = new Set();
  for (const card of DEMO_DECK) {
    assert.ok(card.id);
    assert.ok(card.topic);
    assert.ok(card.question);
    assert.ok(card.answer);
    assert.ok(card.mnemonicCue);
    assert.ok(card.suggestedLocus);
    assert.ok(!ids.has(card.id), `Duplicate ID found: ${card.id}`);
    ids.add(card.id);
  }
});

test("LocusAnchor correctly instantiates and binds world coordinates", () => {
  const anchor = new LocusAnchor("card_1", [0, 110, -150]);
  assert.equal(anchor.isAnchored, false);
  anchor.bind([10, 120, -180]);
  assert.equal(anchor.isAnchored, true);
  assert.deepEqual(anchor.position, [10, 120, -180]);

  const dist = anchor.getDistanceTo([10, 120, -80]);
  assert.equal(Math.round(dist), 100);
});

test("ReviewStore correctly initializes all 6 cards in Leitner Box 1", () => {
  const store = new ReviewStore(DEMO_DECK);
  const stats = store.getStats();
  assert.equal(stats.totalCards, 6);
  assert.equal(stats.testedCount, 0);
  assert.equal(stats.gotItCount, 0);
  assert.equal(stats.missedCount, 0);
  assert.equal(stats.accuracyPercentage, 0);
});

test("ReviewStore promotes card from Box 1 to Box 2 on 'got_it'", () => {
  const store = new ReviewStore(DEMO_DECK);
  const record = store.recordResult("card_1", "got_it");
  assert.equal(record.box, 2);
  assert.equal(record.correctCount, 1);
  assert.equal(record.missedCount, 0);
  assert.equal(record.lastOutcome, "got_it");
});

test("ReviewStore promotes card from Box 2 to Box 3 on repeated 'got_it'", () => {
  const store = new ReviewStore(DEMO_DECK);
  store.recordResult("card_1", "got_it");
  const record = store.recordResult("card_1", "got_it");
  assert.equal(record.box, 3);
  assert.equal(record.correctCount, 2);

  // Box 3 is the ceiling
  const ceiling = store.recordResult("card_1", "got_it");
  assert.equal(ceiling.box, 3);
});

test("ReviewStore demotes card back to Box 1 on 'missed'", () => {
  const store = new ReviewStore(DEMO_DECK);
  store.recordResult("card_1", "got_it");
  store.recordResult("card_1", "got_it"); // In Box 3
  const demoted = store.recordResult("card_1", "missed");
  assert.equal(demoted.box, 1);
  assert.equal(demoted.missedCount, 1);
  assert.equal(demoted.lastOutcome, "missed");
  assert.deepEqual(store.getMissedCards(), ["card_1"]);
});

test("LociManager starts in 'onboard' mode and transitions to 'place' on start", () => {
  const manager = new LociManager(DEMO_DECK);
  assert.equal(manager.mode, "onboard");
  manager.startPlacement();
  assert.equal(manager.mode, "place");
  assert.equal(manager.hud.mode, "Place");
});

test("LociManager pins all 6 cards and updates PeripheralHUD count", () => {
  const manager = new LociManager(DEMO_DECK);
  manager.startPlacement();
  for (let i = 0; i < 6; i++) {
    const success = manager.placeCard([i * 30, 110, -150]);
    assert.equal(success, true);
  }
  assert.equal(manager.placedCount, 6);
  assert.equal(manager.hud.placedCount, 6);
  // Attempting to place beyond 6 returns false
  assert.equal(manager.placeCard([0, 0, 0]), false);
});

test("LociManager enters 'test' mode with hidden answers and reveals on pinch", () => {
  const manager = new LociManager(DEMO_DECK);
  manager.startPlacement();
  for (let i = 0; i < 6; i++) manager.placeCard([i * 30, 110, -150]);

  manager.startTest();
  assert.equal(manager.mode, "test");
  const card = manager.getActiveTestCard();
  assert.ok(card);
  assert.equal(card.isAnswerRevealed, false);

  manager.revealAnswer();
  assert.equal(card.isAnswerRevealed, true);
});

test("LociManager calculates accurate summary metrics (total, correct, missed, percentage)", () => {
  const manager = new LociManager(DEMO_DECK);
  manager.startPlacement();
  for (let i = 0; i < 6; i++) manager.placeCard([i * 30, 110, -150]);

  manager.startTest();
  // 5 Got It, 1 Missed = 5/6 = 83.3%
  manager.revealAnswer(); manager.recordOutcome("got_it");
  manager.revealAnswer(); manager.recordOutcome("got_it");
  manager.revealAnswer(); manager.recordOutcome("missed");
  manager.revealAnswer(); manager.recordOutcome("got_it");
  manager.revealAnswer(); manager.recordOutcome("got_it");
  manager.revealAnswer(); manager.recordOutcome("got_it");

  assert.equal(manager.mode, "summary");
  const stats = manager.reviewStore.getStats();
  assert.equal(stats.testedCount, 6);
  assert.equal(stats.gotItCount, 5);
  assert.equal(stats.missedCount, 1);
  assert.equal(stats.accuracyPercentage, 83.3);
});

test("LociManager filters missed cards correctly when triggering retest", () => {
  const manager = new LociManager(DEMO_DECK);
  manager.startPlacement();
  for (let i = 0; i < 6; i++) manager.placeCard([i * 30, 110, -150]);

  manager.startTest();
  manager.revealAnswer(); manager.recordOutcome("missed"); // card_1 missed
  manager.revealAnswer(); manager.recordOutcome("got_it");
  manager.revealAnswer(); manager.recordOutcome("got_it");
  manager.revealAnswer(); manager.recordOutcome("missed"); // card_4 missed
  manager.revealAnswer(); manager.recordOutcome("got_it");
  manager.revealAnswer(); manager.recordOutcome("got_it");

  assert.equal(manager.mode, "summary");
  const retested = manager.retestMissed();
  assert.equal(retested, true);
  assert.equal(manager.mode, "test");
  assert.equal(manager.testSubset.length, 2);
  assert.equal(manager.testSubset[0].card.id, "card_1");
  assert.equal(manager.testSubset[1].card.id, "card_4");
});

test("PeripheralHUD clamps angle calculations and calculates out-of-view chevrons", () => {
  const hud = new PeripheralHUD(6);
  // In front (0 rad) -> inside FOV -> outOfViewDeg is null
  hud.evaluateDirection(0);
  assert.equal(hud.outOfViewDeg, null);

  // 45 degrees to the right (~0.785 rad) -> outside 32 deg FOV (16 deg half)
  hud.evaluateDirection(Math.PI / 4);
  assert.ok(hud.outOfViewDeg !== null);
  assert.equal(Math.round(hud.outOfViewDeg), 45);
});
