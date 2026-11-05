const registerHintHandler = (io, socket, roomService, gameService) => {
    socket.on("request-hint", (callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            const game = gameService.getGame(room.id);

            if (!game || game.roundStatus !== "drawing") {
                throw new Error("Hints are not available right now");
            }

            // Drawer already knows the complete word.
            if (game.getCurrentDrawer()?.id === socket.id) {
                throw new Error("Drawer does not need hints");
            }

            const hint = game.revealLetter();

            // Broadcast only the masked hint, never the complete word.
            io.to(room.id).emit("hint-updated", {
                hint,
                wordLength: game.hintManager.getWordLength()
            });

            if (typeof callback === "function") {
                callback({
                    success: true,
                    hint
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

module.exports = registerHintHandler;
