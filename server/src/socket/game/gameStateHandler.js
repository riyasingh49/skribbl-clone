const registerGameStateHandler = (
    io,
    socket,
    roomService,
    gameService
) => {
    socket.on("get-game-state", (callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            const game = gameService.getGame(room.id);

            if (!game) {
                throw new Error("No active game found");
            }

            // Get the public state. This must never contain
            // the secret word or private word choices.
            const gameState = game.getGameState();

            // Send public state only to the requesting player.
            socket.emit("game-state-updated", gameState);

            const currentDrawer = game.getCurrentDrawer();
            const isDrawer = currentDrawer?.id === socket.id;

            if (isDrawer) {
                // Only the current drawer can receive word choices.
                if (
                    game.roundStatus === "selecting-word" &&
                    game.wordChoices.length > 0
                ) {
                    socket.emit("word-choices", game.wordChoices);
                }

                // Only the current drawer can receive the secret word.
                if (
                    game.roundStatus === "drawing" &&
                    game.currentWord
                ) {
                    socket.emit("your-word", game.currentWord);
                }
            }

            if (typeof callback === "function") {
                callback({
                    success: true,
                    gameState
                });
            }
        } catch (error) {
            if (typeof callback === "function") {
                callback({
                    success: false,
                    message: error.message
                });
            } else {
                socket.emit("game-state-error", {
                    message: error.message
                });
            }
        }
    });
};

module.exports = registerGameStateHandler;
