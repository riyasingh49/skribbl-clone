class PlayerDepartureManager {
    constructor(game) {
        this.game = game;
    }

    removePlayer(playerId) {
        const game = this.game;
        const currentDrawer = game.getCurrentDrawer();
        const wasDrawer = currentDrawer?.id === playerId;

        game.roundManager.removePlayer(playerId);

        if (!wasDrawer) {
            if (game.room.getPlayerCount() < 2) {
                game.endGame();
            }

            return game.getGameState();
        }

        game.resetRoundData();

        if (game.room.getPlayerCount() < 2) {
            game.endGame();
            return game.getGameState();
        }

        const state = game.roundManager.handleDrawerDeparture();

        game.roundStatus = state.roundStatus;

        if (game.roundStatus === "finished") {
            game.endGame();
        }

        return game.getGameState();
    }
}

module.exports = PlayerDepartureManager;
