class HintManager {
    constructor() {
        this.word = "";
        this.revealedIndexes = new Set();
    }

    setWord(word) {
        if (typeof word !== "string" || !word.trim()) {
            throw new Error("A valid word is required");
        }

        this.word = word.trim();
        this.revealedIndexes.clear();
    }

    createHint() {
        if (!this.word) return "";

        return [...this.word]
            .map((character, index) => {
                if (character === " ") return " ";

                return this.revealedIndexes.has(index)
                    ? character
                    : "_";
            })
            .join("");
    }

    revealLetter() {
        if (!this.word) {
            throw new Error("No word has been selected");
        }

        const hiddenIndexes = [];

        [...this.word].forEach((character, index) => {
            if (
                character !== " " &&
                !this.revealedIndexes.has(index)
            ) {
                hiddenIndexes.push(index);
            }
        });

        if (hiddenIndexes.length === 0) {
            return this.createHint();
        }

        const randomIndex = Math.floor(
            Math.random() * hiddenIndexes.length
        );

        this.revealedIndexes.add(hiddenIndexes[randomIndex]);

        return this.createHint();
    }

    getHint() {
        return this.createHint();
    }

    getWordLength() {
        return [...this.word].filter(
            (character) => character !== " "
        ).length;
    }

    reset() {
        this.word = "";
        this.revealedIndexes.clear();
    }
}

module.exports = HintManager;
