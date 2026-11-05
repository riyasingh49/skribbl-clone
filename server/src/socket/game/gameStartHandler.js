const Game = require("../../classes/Game");
const { sendWordChoices } = require("./gameUtils");

const registerGameStartHandler = (io, socket, roomService, gameService) => {

    socket.on("start-game", (callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            if (room.hostId !== socket.id) {
                throw new Error("Only the room host can start the game");
            }

            if (room.getPlayerCount() < 2) {
                throw new Error("At least 2 players are required");
            }

            if (gameService.hasGame(room.id)) {
                throw new Error("A game is already running in this room");
            }

            const game = new Game(room);

            gameService.createGame(room.id, game);

            const gameState = game.startGame();

            sendWordChoices(io, game);

            io.to(room.id).emit("game-started", gameState);

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

module.exports = registerGameStartHandler;
