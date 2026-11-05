const handleGuess = require("./guessHandler");
const registerMessageHandler = (
    io,
    socket,
    roomService,
    gameService
) => {

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

            // Check whether this message is a correct guess.
            const guessResult = handleGuess(
                io,
                room,
                game,
                player,
                message
            );

            if (guessResult.correct) {
                if (typeof callback === "function") {
                    callback({
                        success: true,
                        correct: true
                    });
                }

                return;
            }

            // Do not broadcast messages from the drawer during drawing.
            if (
                game &&
                game.roundStatus === "drawing" &&
                game.getCurrentDrawer()?.id === socket.id
            ) {
                throw new Error(
                    "The drawer cannot send messages during their turn"
                );
            }

            // Broadcast ordinary chat or incorrect guesses.
            io.to(room.id).emit("chat-message", {
                id: socket.id,
                username: player.username,
                message,
                timestamp: Date.now()
            });

            if (typeof callback === "function") {
                callback({
                    success: true,
                    correct: false,
                    incorrectGuess: guessResult.isGuess
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

module.exports = registerMessageHandler;
