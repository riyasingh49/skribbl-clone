const Player = require("./src/classes/Player");

const player = new Player("123", "Riya");

console.log("Initial player:", player);

player.addPoints(50);
player.addPoints(30);

console.log("Updated score:", player.score);

player.resetScore();

console.log("After reset:", player.score);