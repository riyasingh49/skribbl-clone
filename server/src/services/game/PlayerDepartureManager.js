class PlayerDepartureManager {
    constructor(game) {
        this.game = game;
    }

    removePlayer(playerId) {
        const game = this.game;
        const roundManager = game.roundManager;

        // Find the drawer from the drawing order. The player may
        // already have been removed from room.players.
        const currentDrawerId =
            roundManager.playerOrder[roundManager.currentDrawerIndex];

        const wasDrawer = currentDrawerId === playerId;
        const previousStatus = game.roundStatus;

        // Remove the player from the drawing order.
        roundManager.removePlayer(playerId);

        // End the game if fewer than two players remain.
        if (game.room.getPlayerCount() < 2) {
            game.endGame();
            return game.getGameState();
        }

        // A non-drawer leaving does not interrupt the current turn.
        if (!wasDrawer) {
            return game.getGameState();
        }

        // Do not restart a round that has already ended.
        if (
            previousStatus !== "drawing" &&
            previousStatus !== "selecting-word"
        ) {
            return game.getGameState();
        }

        // Stop the timer and clear the previous secret word,
        // word choices, hints and round-specific scores.
        game.resetRoundData();

        // The next available player becomes the drawer.
        const state = roundManager.handleDrawerDeparture();

        game.roundStatus = state.roundStatus;

        if (game.roundStatus === "finished") {
            game.endGame();
        }

        return game.getGameState();
    }
}

module.exports = PlayerDepartureManager;
