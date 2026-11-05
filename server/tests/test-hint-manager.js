
const HintManager = require("../src/services/game/HintManager");

const hints = new HintManager();

hints.setWord("ELEPHANT");

console.log("Initial hint:", hints.getHint());

console.log("After first reveal:", hints.revealLetter());

console.log("After second reveal:", hints.revealLetter());

console.log("Word length:", hints.getWordLength());

hints.reset();

console.log("After reset:", hints.getHint());
