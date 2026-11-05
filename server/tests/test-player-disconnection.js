
const Player = require("../src/classes/Player");
const Room = require("../src/classes/Room");
const Game = require("../src/classes/Game");

const alice = new Player("1", "Alice");
const bob = new Player("2", "Bob");
const charlie = new Player("3", "Charlie");

const room = new Room("TEST1", alice, {
    totalRounds: 3,
    drawTime: 80
});

room.addPlayer(bob);
room.addPlayer(charlie);

const game = new Game(room);

// Start the game.
game.startGame();

console.assert(
    game.getCurrentDrawer().username === "Alice",
    "Alice should draw first"
);

// Select a word and start drawing.
game.setWordChoices(["apple", "banana", "orange"]);
game.setWord("apple");

// Alice disconnects.
room.removePlayer("1");
game.removePlayer("1");

console.assert(
    game.roundStatus === "selecting-word",
    "Game should return to word selection"
);

console.assert(
    game.getCurrentDrawer().username === "Bob",
    "Bob should become the next drawer"
);

console.assert(
    game.currentWord === null,
    "Previous secret word should be cleared"
);

// Remove Bob and Charlie until fewer than two players remain.
room.removePlayer("2");
game.removePlayer("2");

console.assert(
    game.roundStatus === "finished",
    "Game should finish when fewer than two players remain"
);

console.log("All player disconnection tests passed!");
