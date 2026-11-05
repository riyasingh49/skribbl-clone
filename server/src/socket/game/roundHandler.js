const {
    sendWordChoices,
    broadcastGameState,
    broadcastGameFinished
} = require("./gameUtils");

const registerRoundHandler = (io, socket, roomService, gameService) => {

    // Manually end the current round.
    socket.on("end-round", (callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            if (room.hostId !== socket.id) {
                throw new Error("Only the host can end the round");
            }

            const game = gameService.getGame(room.id);

            if (!game) {
                throw new Error("No active game found");
            }

            if (!game.endRound()) {
                throw new Error("There is no active drawing round");
            }

            io.to(room.id).emit("round-ended", {
                reason: "host-ended",
                correctWord: game.currentWord,
                leaderboard: game.getLeaderboard()
            });

            broadcastGameState(io, room.id, game);

            if (typeof callback === "function") {
                callback({ success: true });
            }

        } catch (error) {
            if (typeof callback === "function") {
                callback({
                    success: false,
                    error: error.message
                });
            }
        }
    });

    // Start the next turn.
    socket.on("next-turn", (callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            if (room.hostId !== socket.id) {
                throw new Error("Only the host can start the next turn");
            }

            const game = gameService.getGame(room.id);

            if (!game) {
                throw new Error("No active game found");
            }

            const gameState = game.nextTurn();

            if (game.isGameFinished()) {
                broadcastGameFinished(io, room.id, game);
                gameService.removeGame(room.id);
            } else {
                sendWordChoices(io, game);

                io.to(room.id).emit("next-turn-started", gameState);
            }

            if (typeof callback === "function") {
                callback({
                    success: true,
                    game: gameState
                });
            }

        } catch (error) {
            if (typeof callback === "function") {
                callback({
                    success: false,
                    error: error.message
                });
            }
        }
    });
};

module.exports = registerRoundHandler;
