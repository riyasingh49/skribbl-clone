const { getRandomWords } = require("../src/data/words");

const choices = getRandomWords(3);

console.log("Generated word choices:", choices);
console.log("Number of choices:", choices.length);
console.log(
    "All choices unique:",
    new Set(choices).size === choices.length
);
