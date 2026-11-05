const Player = require("../src/classes/Player");
const Room = require("../src/classes/Room");
const ScoreManager = require("../src/services/game/ScoreManager");

const host = new Player("1", "Alice");
const room = new Room("ABC123", host);

const bob = new Player("2", "Bob");
const charlie = new Player("3", "Charlie");

room.addPlayer(bob);
room.addPlayer(charlie);

const scores = new ScoreManager(room);

console.log(
    "Bob guesses:",
    scores.recordCorrectGuess("2", "1")
);

console.log(
    "Charlie guesses:",
    scores.recordCorrectGuess("3", "1")
);

console.log("Leaderboard:", scores.getLeaderboard());
console.log("Winner:", scores.getWinner());

scores.resetRound();

console.log(
    "Bob can guess again:",
    !scores.hasGuessedCorrectly("2")
);
