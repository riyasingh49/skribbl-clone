const registerGameStateHandler = (socket, roomService, gameService) => {
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
            if (typeof callback === "function") {
                callback({
                    success: true,
                    game: game.getGameState()
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

module.exports = registerGameStateHandler;
