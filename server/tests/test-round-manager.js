const Player = require("../src/classes/Player");
const Room = require("../src/classes/Room");
const RoundManager = require("../src/services/game/RoundManager");

const alice = new Player("1", "Alice");
const bob = new Player("2", "Bob");
const charlie = new Player("3", "Charlie");

const room = new Room("TEST1", alice, {
    totalRounds: 2
});

room.addPlayer(bob);
room.addPlayer(charlie);

const roundManager = new RoundManager(room);

// Test 1: Start game
roundManager.startGame();

console.assert(
    roundManager.currentRound === 1,
    "Game should start at round 1"
);

console.assert(
    roundManager.getCurrentDrawer().username === "Alice",
    "Alice should draw first"
);

// Test 2: Start drawing
roundManager.startDrawing();

console.assert(
    roundManager.roundStatus === "drawing",
    "Round status should be drawing"
);

// Test 3: End first turn
roundManager.endRound();
roundManager.nextTurn();

console.assert(
    roundManager.getCurrentDrawer().username === "Bob",
    "Bob should draw second"
);

// Test 4: Third player's turn
roundManager.startDrawing();
roundManager.endRound();
roundManager.nextTurn();

console.assert(
    roundManager.getCurrentDrawer().username === "Charlie",
    "Charlie should draw third"
);

// Test 5: Move to round 2
roundManager.startDrawing();
roundManager.endRound();
roundManager.nextTurn();

console.assert(
    roundManager.currentRound === 2,
    "Game should move to round 2"
);

console.assert(
    roundManager.getCurrentDrawer().username === "Alice",
    "Alice should draw first in round 2"
);

// Test 6: Finish game
for (let i = 0; i < 3; i++) {
    roundManager.startDrawing();
    roundManager.endRound();
    roundManager.nextTurn();
}

console.assert(
    roundManager.isGameFinished(),
    "Game should finish after all rounds"
);

console.log("All RoundManager tests passed!");
