const Game = require("../classes/Game");
const { getRandomWords } = require("../data/words");

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

            // Generate 3 random word choices
            const wordChoices = getRandomWords(3);

            // Store choices inside Game
            game.setWordChoices(wordChoices);

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

            // Send word choices ONLY to the drawer
            io.to(currentDrawer.id).emit("word-choices", wordChoices);

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


    // SELECT WORD
    socket.on("select-word", (data, callback) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);

            if (!room) {
                throw new Error("You are not in a room");
            }

            const game = activeGames.get(room.id);

            if (!game) {
                throw new Error("No active game found");
            }

            // Only the current drawer can select a word
            const currentDrawer = game.getCurrentDrawer();

            if (currentDrawer.id !== socket.id) {
                throw new Error("Only the drawer can select a word");
            }

            const { word } = data || {};

            // Game class validates the selected word
            game.setWord(word);

            // Notify everyone that drawing has started
            io.to(room.id).emit("drawing-started", {
                drawer: {
                    id: currentDrawer.id,
                    username: currentDrawer.username
                },
                currentRound: game.currentRound,
                totalRounds: game.totalRounds,
                status: game.roundStatus
            });

            // Send the actual word only to the drawer
            socket.emit("your-word", {
                word: game.currentWord
            });

            if (typeof callback === "function") {
                callback({
                    success: true,
                    message: "Word selected successfully"
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
