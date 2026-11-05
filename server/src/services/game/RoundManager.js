class RoundManager {
    constructor(room, totalRounds = room.settings.totalRounds) {
        if (!room) {
            throw new Error("A valid room is required");
        }

        this.room = room;
        this.totalRounds = totalRounds;
        this.currentRound = 0;
        this.currentDrawerIndex = 0;

        this.playerOrder = room.getPlayers().map(
            player => player.id
        );

        this.roundStatus = "waiting";
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

        return this.startRound();
    }

    startRound() {
        if (this.roundStatus === "finished") {
            throw new Error("Game has already finished");
        }

        const drawer = this.getCurrentDrawer();

        if (!drawer) {
            this.endGame();
            throw new Error("No available drawer found");
        }

        this.roundStatus = "selecting-word";

        return this.getState();
    }

    startDrawing() {
        if (this.roundStatus !== "selecting-word") {
            throw new Error("A word cannot be selected right now");
        }

        this.roundStatus = "drawing";

        return this.getState();
    }

    endRound() {
        if (this.roundStatus !== "drawing") {
            throw new Error("No active drawing round to end");
        }

        this.roundStatus = "round-ended";

        return this.getState();
    }

    nextTurn() {
        if (this.roundStatus !== "round-ended") {
            throw new Error(
                "Current round must end before the next turn"
            );
        }

        if (this.playerOrder.length === 0) {
            this.endGame();
            return this.getState();
        }

        this.currentDrawerIndex++;

        if (this.currentDrawerIndex >= this.playerOrder.length) {
            this.currentRound++;
            this.currentDrawerIndex = 0;
        }

        if (this.currentRound > this.totalRounds) {
            this.endGame();
            return this.getState();
        }

        // Skip any player who is no longer in the room.
        let attempts = 0;

        while (
            attempts < this.playerOrder.length &&
            !this.room.players.has(
                this.playerOrder[this.currentDrawerIndex]
            )
        ) {
            this.currentDrawerIndex =
                (this.currentDrawerIndex + 1) %
                this.playerOrder.length;

            attempts++;
        }

        if (attempts >= this.playerOrder.length) {
            this.endGame();
            return this.getState();
        }

        return this.startRound();
    }

    // Remove a player from the drawing order.
    removePlayer(playerId) {
        const playerIndex = this.playerOrder.indexOf(playerId);

        if (playerIndex === -1) {
            return null;
        }

        this.playerOrder.splice(playerIndex, 1);

        if (this.playerOrder.length === 0) {
            this.currentDrawerIndex = 0;
            return null;
        }

        if (playerIndex < this.currentDrawerIndex) {
            this.currentDrawerIndex--;
        }

        if (this.currentDrawerIndex >= this.playerOrder.length) {
            this.currentDrawerIndex = 0;
        }

        return this.getCurrentDrawer();
    }

    // Prepare the next available player after the drawer leaves.
    handleDrawerDeparture() {
        if (
            this.roundStatus !== "drawing" &&
            this.roundStatus !== "selecting-word"
        ) {
            throw new Error(
                "Drawer departure cannot be handled in the current state"
            );
        }

        const nextDrawer = this.getCurrentDrawer();

        if (!nextDrawer) {
            this.endGame();
            return this.getState();
        }

        // The current drawer was removed from playerOrder.
        // The player now at the same index becomes the new drawer.
        this.roundStatus = "selecting-word";

        return this.getState();
    }

    getCurrentDrawer() {
        if (this.playerOrder.length === 0) {
            return null;
        }

        const playerId = this.playerOrder[this.currentDrawerIndex];

        return this.room.players.get(playerId) || null;
    }

    endGame() {
        this.roundStatus = "finished";
    }

    getState() {
        const drawer = this.getCurrentDrawer();

        return {
            currentRound: this.currentRound,
            totalRounds: this.totalRounds,
            roundStatus: this.roundStatus,
            drawer: drawer
                ? {
                    id: drawer.id,
                    username: drawer.username
                }
                : null
        };
    }

    isGameFinished() {
        return this.roundStatus === "finished";
    }
}

module.exports = RoundManager;
