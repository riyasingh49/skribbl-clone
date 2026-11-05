const { getRandomWords } = require("../../data/words");

// Send word choices privately to the drawer.
const sendWordChoices = (io, game) => {
    const drawer = game.getCurrentDrawer();

    if (!drawer) {
        throw new Error("Current drawer not found");
    }

    const choices = getRandomWords(3);

    game.setWordChoices(choices);

    io.to(drawer.id).emit("word-choices", choices);
};

// Broadcast public game state to all players.
const broadcastGameState = (io, roomId, game) => {
    io.to(roomId).emit(
        "game-state-updated",
        game.getGameState()
    );
};

// Broadcast final game results.
const broadcastGameFinished = (io, roomId, game) => {
    io.to(roomId).emit("game-finished", {
        winner: game.getWinner(),
        leaderboard: game.getLeaderboard(),
        gameState: game.getGameState()
    });
};

module.exports = {
    sendWordChoices,
    broadcastGameState,
    broadcastGameFinished
};
