
const Player = require("../src/classes/Player");
const Room = require("../src/classes/Room");
const Game = require("../src/classes/Game");

// Create players
const player1 = new Player("101", "Riya");
const player2 = new Player("102", "Alex");
const player3 = new Player("103", "Sam");

// Create room
const room = new Room("ABC123", player1, {
    totalRounds: 2
});

room.addPlayer(player2);
room.addPlayer(player3);

// Create game
const game = new Game(room);

// Helper function to select a word and finish a turn
const finishTurn = (word) => {
    game.setWordChoices([
        word,
        "Guitar",
        "Rainbow"
    ]);

    game.setWord(word);

    console.log("Selected word:", game.currentWord);

    game.endRound();
    game.nextTurn();
};

console.log("Starting game...");

game.startGame();

console.log("Current round:", game.currentRound);
console.log("Current drawer:", game.getCurrentDrawer().username);

// Round 1
finishTurn("Apple");

console.log("\nNext drawer:", game.getCurrentDrawer().username);

finishTurn("House");

console.log("\nNext drawer:", game.getCurrentDrawer().username);

finishTurn("Car");

console.log("\nRound 2 begins");
console.log("Current round:", game.currentRound);
console.log("Current drawer:", game.getCurrentDrawer().username);

// Round 2
finishTurn("Tree");
finishTurn("Book");
finishTurn("Sun");

console.log("\nFinal game status:", game.roundStatus);
