const Player = require("./src/classes/Player");
const Room = require("./src/classes/Room");
const Game = require("./src/classes/Game");

// Create players
const player1 = new Player("101", "Riya");
const player2 = new Player("102", "Alex");
const player3 = new Player("103", "Sam");

// Create a room with 2 rounds
const room = new Room("ABC123", player1, {
    totalRounds: 2
});

// Add remaining players
room.addPlayer(player2);
room.addPlayer(player3);

// Create game
const game = new Game(room);

console.log("Starting game...");

game.startGame();

console.log("Current round:", game.currentRound);
console.log("Current drawer:", game.getCurrentDrawer().username);

// Round 1
game.setWord("Apple");
console.log("Selected word:", game.currentWord);

game.endRound();
game.nextTurn();

console.log("\nNext drawer:", game.getCurrentDrawer().username);

// Player 2 finishes
game.setWord("House");
game.endRound();
game.nextTurn();

console.log("\nNext drawer:", game.getCurrentDrawer().username);

// Player 3 finishes
game.setWord("Car");
game.endRound();
game.nextTurn();

console.log("\nRound 2 begins");
console.log("Current round:", game.currentRound);
console.log("Current drawer:", game.getCurrentDrawer().username);

// Finish remaining turns
game.setWord("Tree");
game.endRound();
game.nextTurn();

game.setWord("Book");
game.endRound();
game.nextTurn();

game.setWord("Sun");
game.endRound();
game.nextTurn();

console.log("\nFinal game status:", game.roundStatus);
