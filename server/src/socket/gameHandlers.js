const Game = require("../classes/Game");

// Store active games by room ID.
// This Map is shared by all socket connections.
const activeGames = new Map();

const registerGameHandlers = (io, socket, roomService) => {

    // START GAME
    socket.on("start-game", (callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            // Only the host can start the game
            if (room.hostId !== socket.id) {
                throw new Error("Only the host can start the game");
            }

            // At least two players are required
            if (room.getPlayerCount() < 2) {
                throw new Error("At least 2 players are required");
            }

            // Prevent multiple games in the same room
            if (activeGames.has(room.id)) {
                throw new Error("Game has already started");
            }

            const game = new Game(room);

            game.startGame();

            activeGames.set(room.id, game);

            const currentDrawer = game.getCurrentDrawer();

            // Notify all players that the game has started
            io.to(room.id).emit("game-started", {
                roomId: room.id,
                currentRound: game.currentRound,
                totalRounds: game.totalRounds,
                drawer: {
                    id: currentDrawer.id,
                    username: currentDrawer.username
                },
                status: game.roundStatus
            });

            // Acknowledge successful start
            if (typeof callback === "function") {
                callback({
                    success: true,
                    message: "Game started successfully"
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

module.exports = registerGameHandlers;
