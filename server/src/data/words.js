const words = [
    "Elephant",
    "Guitar",
    "Rainbow",
    "Airplane",
    "Pizza",
    "Butterfly",
    "Volcano",
    "Football",
    "Castle",
    "Dinosaur",
    "Helicopter",
    "Watermelon",
    "Telescope",
    "Octopus",
    "Snowman",
    "Computer",
    "Umbrella",
    "Firefighter",
    "Spaceship",
    "Penguin",
    "Basketball",
    "Lighthouse",
    "Pyramid",
    "Toothbrush",
    "Dragon",
    "Submarine",
    "Crocodile",
    "Popcorn",
    "Giraffe",
    "Keyboard"
];

const getRandomWords = (count = 3) => {
    if (!Number.isInteger(count) || count < 1 || count > words.length) {
        throw new Error("Invalid number of words requested");
    }

    const shuffled = [...words];

    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled.slice(0, count);
};

module.exports = {
    words,
    getRandomWords
};
