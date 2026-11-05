const registerChatHandlers = (io, socket, roomService, gameService) => {
    socket.on("send-message", (data, callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            const player = room.players.get(socket.id);

            if (!player) {
                throw new Error("Player not found in room");
            }

            const message =
                typeof data?.message === "string"
                    ? data.message.trim()
                    : "";

            if (!message) {
                throw new Error("Message cannot be empty");
            }

            if (message.length > 200) {
                throw new Error("Message must be 200 characters or fewer");
            }

            const game = gameService.getGame(room.id);

            // During a drawing round, the drawer cannot send chat guesses.
            if (
                game &&
                game.roundStatus === "drawing" &&
                game.getCurrentDrawer()?.id === socket.id
            ) {
                throw new Error("The drawer cannot send messages during their turn");
            }

            // Check whether this message is the correct word.
            if (game && game.roundStatus === "drawing" && game.currentWord) {
                const normalizedGuess = message.toLowerCase();
                const normalizedWord = game.currentWord.trim().toLowerCase();

                if (normalizedGuess === normalizedWord) {
                    if (game.correctGuessers.has(socket.id)) {
                        throw new Error("You have already guessed correctly");
                    }

                    game.correctGuessers.add(socket.id);

                    io.to(room.id).emit("correct-guess", {
                        username: player.username,
                        word: game.currentWord,
                        playerId: socket.id,
                    });

                    if (typeof callback === "function") {
                        callback({ success: true, correct: true });
                    }

                    return;
                }
            }

            const isGuessing =
                game &&
                game.roundStatus === "drawing" &&
                Boolean(game.currentWord);

            io.to(room.id).emit("chat-message", {
                id: socket.id,
                username: player.username,
                message,
                timestamp: Date.now(),
            });

            if (typeof callback === "function") {
                callback({
                    success: true,
                    correct: false,
                    incorrectGuess: isGuessing,
                });
            }
        } catch (error) {
            if (typeof callback === "function") {
                callback({
                    success: false,
                    error: error.message,
                });
            }
        }
    });
};

module.exports = registerChatHandlers;
