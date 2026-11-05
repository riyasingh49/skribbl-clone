const { broadcastGameState } = require("./gameUtils");
const registerWordSelectionHandler = (io, socket, roomService, gameService) => {
    socket.on("select-word", (data, callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);
            if (!room) {
                throw new Error("You are not in a room");
            }
            const game = gameService.getGame(room.id);
            if (!game) {
                throw new Error("No active game found");
            }
            const drawer = game.getCurrentDrawer();
            if (!drawer || drawer.id !== socket.id) {
                throw new Error("Only the current drawer can select a word");
            }
            // Validate the selected word and start the drawing round.
            const selectedWord = data?.word;
            game.setWord(selectedWord);

            // Notify all players that drawing has started.
            io.to(room.id).emit("drawing-started", {
                ...game.getGameState(),
                drawer: {
                    id: drawer.id,
                    username: drawer.username
                }
            });

            // Send the secret word only to the drawer.
            io.to(drawer.id).emit("your-word", {
                word: game.currentWord
            });

            // Start the drawing timer.
            game.startTimer(
                (remainingTime) => {
                    io.to(room.id).emit("timer-update", {
                        remainingTime
                    });
                },
                () => {
                    io.to(room.id).emit("round-ended", {
                        reason: "time-up",
                        correctWord: game.currentWord,
                        leaderboard: game.getLeaderboard()
                    });

                    broadcastGameState(io, room.id, game);
                }
            );

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
};

module.exports = registerWordSelectionHandler;
