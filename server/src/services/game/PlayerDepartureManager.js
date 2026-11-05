class PlayerDepartureManager {
    constructor(game) {
        this.game = game;
    }

    removePlayer(playerId) {
        const game = this.game;
        const currentDrawer = game.getCurrentDrawer();
        const wasDrawer = currentDrawer?.id === playerId;
        const previousStatus = game.roundStatus;

        // Remove the player from the drawing order.
        game.roundManager.removePlayer(playerId);

        // End the game if fewer than two players remain.
        if (game.room.getPlayerCount() < 2) {
            game.endGame();
            return game.getGameState();
        }

        // A non-drawer leaving does not interrupt the current turn.
        if (!wasDrawer) {
            return game.getGameState();
        }

        // If the round is already over, do not start another
        // drawer-selection phase just because the drawer left.
        if (
            previousStatus !== "drawing" &&
            previousStatus !== "selecting-word"
        ) {
            return game.getGameState();
        }

        // Stop the timer and clear the previous round's data.
        game.resetRoundData();

        // Prepare the next available drawer.
        const state = game.roundManager.handleDrawerDeparture();

        game.roundStatus = state.roundStatus;

        if (game.roundStatus === "finished") {
            game.endGame();
        }

        return game.getGameState();
    }
}

module.exports = PlayerDepartureManager;
