class Game {
    constructor(room) {
        this.room = room;

        // Game configuration comes from the Room
        this.totalRounds = room.settings.totalRounds;

        // Game state
        this.currentRound = 0;
        this.currentDrawerIndex = 0;
        this.currentWord = null;
        this.roundStatus = "waiting";

        // Preserve the order in which players joined
        this.playerOrder = room.getPlayers().map(
            (player) => player.id
        );
    }

    startGame() {
        if (this.playerOrder.length < 2) {
            throw new Error("At least 2 players are required to start");
        }

        if (this.roundStatus !== "waiting") {
            throw new Error("Game has already started");
        }

        this.currentRound = 1;
        this.currentDrawerIndex = 0;

        this.startRound();
    }

    startRound() {
        this.currentWord = null;
        this.roundStatus = "selecting-word";
    }

    getCurrentDrawer() {
        const drawerId = this.playerOrder[this.currentDrawerIndex];

        return this.room.players.get(drawerId) || null;
    }

    setWord(word) {
        if (this.roundStatus !== "selecting-word") {
            throw new Error("Word cannot be selected right now");
        }

        if (typeof word !== "string" || !word.trim()) {
            throw new Error("A valid word must be selected");
        }

        this.currentWord = word.trim();
        this.roundStatus = "drawing";
    }

    endRound() {
        if (this.roundStatus !== "drawing") {
            throw new Error("No active drawing round to end");
        }

        this.roundStatus = "round-ended";
    }

    nextTurn() {
        if (this.roundStatus !== "round-ended") {
            throw new Error("Current round must end before next turn");
        }

        this.currentDrawerIndex++;

        // All players have drawn in the current round
        if (this.currentDrawerIndex >= this.playerOrder.length) {
            this.currentRound++;

            // All game rounds are complete
            if (this.currentRound > this.totalRounds) {
                this.endGame();
                return;
            }

            // Start a new round from the first player
            this.currentDrawerIndex = 0;
        }

        this.startRound();
    }

    endGame() {
        this.currentWord = null;
        this.roundStatus = "finished";
    }
}

module.exports = Game;
