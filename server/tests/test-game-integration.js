const Player = require("../src/classes/Player");
const Room = require("../src/classes/Room");
const Game = require("../src/classes/Game");

const alice = new Player("1", "Alice");
const bob = new Player("2", "Bob");

const room = new Room("TEST1", alice, {
    totalRounds: 1,
    drawTime: 80
});

room.addPlayer(bob);

const game = new Game(room);

// Start game
game.startGame();

console.assert(
    game.roundStatus === "selecting-word",
    "Game should enter word selection"
);

// Set word choices
game.setWordChoices(["apple", "banana", "orange"]);

// Select word
game.setWord("apple");

console.assert(
    game.roundStatus === "drawing",
    "Game should enter drawing status"
);

console.assert(
    game.getHint() === "_____",
    "Hint should mask all five letters"
);

// Correct guess
const result = game.recordCorrectGuess("2");

console.assert(
    result.guesserPoints === 100,
    "First correct guesser should receive 100 points"
);

console.assert(
    alice.score === 50,
    "Drawer should receive 50 points"
);

// End round
game.endRound();

// Finish the game
game.nextTurn();

console.assert(
    game.roundStatus === "finished",
    "Game should finish after one complete round"
);

console.assert(
    game.getWinner().username === "Alice",
    "Alice should win with the higher score"
);

console.log("All Game integration tests passed!");
