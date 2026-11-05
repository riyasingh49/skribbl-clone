const RoundManager = require("../services/game/RoundManager");
const ScoreManager = require("../services/game/ScoreManager");
const HintManager = require("../services/game/HintManager");
const TimerManager = require("../services/game/TimerManager");
const PlayerDepartureManager = require("../services/game/PlayerDepartureManager");

class Game {
    constructor(room) {
        if (!room) {
            throw new Error("A valid room is required");
        }

        this.room = room;

        this.roundManager = new RoundManager(room);
        this.scoreManager = new ScoreManager(room);
        this.hintManager = new HintManager();
        this.timerManager = new TimerManager();

        this.departureManager = new PlayerDepartureManager(this);

        this.currentWord = null;
        this.wordChoices = [];
        this.drawTime = room.settings.drawTime || 80;
        this.roundStatus = "waiting";
    }

    startGame() {
        this.scoreManager.resetAllScores();
        const state = this.roundManager.startGame();
        this.roundStatus = state.roundStatus;
        return this.getGameState();
    }

    setWordChoices(choices) {
        if (this.roundStatus !== "selecting-word") {
            throw new Error("Word choices cannot be set right now");
        }

        if (
            !Array.isArray(choices) ||
            choices.length !== 3 ||
            choices.some(word => typeof word !== "string" || !word.trim()) ||
            new Set(choices.map(word => word.trim())).size !== 3
        ) {
            throw new Error("Exactly 3 unique valid word choices are required");
        }

        this.wordChoices = choices.map(word => word.trim());
    }

    setWord(word) {
        if (
            this.roundStatus !== "selecting-word" ||
            !this.wordChoices.includes(word)
        ) {
            throw new Error("Invalid word selection");
        }

        this.currentWord = word;
        this.wordChoices = [];
        this.hintManager.setWord(word);

        this.roundManager.startDrawing();
        this.roundStatus = "drawing";

        return this.getGameState();
    }

    revealLetter() {
        if (this.roundStatus !== "drawing") {
            throw new Error("Hints are only available during drawing");
        }

        return this.hintManager.revealLetter();
    }

    startTimer(onTick, onEnd) {
        if (this.roundStatus !== "drawing") {
            throw new Error("Timer can only start during drawing");
        }

        this.timerManager.start(this.drawTime, onTick, () => {
            if (this.endRound() && typeof onEnd === "function") {
                onEnd();
            }
        });
    }

    stopTimer() {
        this.timerManager.stop();
    }

    recordCorrectGuess(playerId) {
        if (this.roundStatus !== "drawing") {
            throw new Error("There is no active drawing round");
        }

        const drawer = this.getCurrentDrawer();

        if (!drawer) {
            throw new Error("Current drawer not found");
        }

        const result = this.scoreManager.recordCorrectGuess(
            playerId,
            drawer.id
        );

        return {
            ...result,
            leaderboard: this.getLeaderboard()
        };
    }

    hasPlayerGuessed(playerId) {
        return this.scoreManager.hasGuessedCorrectly(playerId);
    }

    endRound() {
        if (this.roundStatus !== "drawing") return false;

        this.stopTimer();
        this.roundManager.endRound();
        this.roundStatus = "round-ended";

        return true;
    }

    nextTurn() {
        if (this.roundStatus !== "round-ended") {
            throw new Error("Current round must end before the next turn");
        }

        this.resetRoundData();

        const state = this.roundManager.nextTurn();
        this.roundStatus = state.roundStatus;

        return this.getGameState();
    }

    resetRoundData() {
        this.stopTimer();

        this.currentWord = null;
        this.wordChoices = [];

        this.hintManager.reset();
        this.scoreManager.resetRound();
    }

    removePlayer(playerId) {
        return this.departureManager.removePlayer(playerId);
    }

    getCurrentDrawer() {
        return this.roundManager.getCurrentDrawer();
    }

    getLeaderboard() {
        return this.scoreManager.getLeaderboard();
    }

    getWinner() {
        return this.scoreManager.getWinner();
    }

    endGame() {
        this.stopTimer();

        this.currentWord = null;
        this.wordChoices = [];

        this.hintManager.reset();
        this.roundManager.endGame();

        this.roundStatus = "finished";
    }

    getGameState() {
        const state = this.roundManager.getState();

        return {
            ...state,
            roundStatus: this.roundStatus,
            hint: this.roundStatus === "drawing"
                ? this.hintManager.getHint()
                : null,
            leaderboard: this.getLeaderboard()
        };
    }
}

module.exports = Game;
