const {
    sendWordChoices
} = require("../game/gameUtils");

const getPublicRoomData = (room) => {
    return {
        id: room.id,
        roomId: room.id,
        hostId: room.hostId,

        players: room.getPlayers().map(player => ({
            id: player.id,
            username: player.username,
            score: player.score
        })),

        playerCount: room.getPlayerCount(),
        settings: { ...room.settings }
    };
};

const broadcastRoomUpdate = (io, room) => {
    io.to(room.id).emit(
        "room-updated",
        getPublicRoomData(room)
    );
};

const handlePlayerLeaving = (
    io,
    socket,
    roomService,
    gameService
) => {
    const room = roomService.getRoomForSocket(socket.id);

    if (!room) {
        return null;
    }

    const roomId = room.id;
    const player = room.players.get(socket.id);

    if (!player) {
        roomService.leaveRoom(socket.id);
        socket.leave(roomId);
        return null;
    }

    const game = gameService.getGame(roomId);

    // Update game state before removing the player from the room.
    if (game) {
        game.removePlayer(socket.id);
    }

    // Remove player from room and transfer host if necessary.
    const result = roomService.leaveRoom(socket.id);

    if (!result) {
        return null;
    }

    socket.leave(roomId);

    // Notify remaining players.
    io.to(roomId).emit("player-left", {
        id: player.id,
        username: player.username
    });

    if (game) {
        // End the game if fewer than two players remain.
        if (room.getPlayerCount() < 2) {
            game.endGame();

            io.to(roomId).emit("game-finished", {
                winner: game.getWinner(),
                leaderboard: game.getLeaderboard(),
                gameState: game.getGameState(),
                reason: "not-enough-players"
            });

            gameService.removeGame(roomId);
        }

        // A replacement drawer needs fresh word choices.
        else if (
            game.roundStatus === "selecting-word" &&
            game.getCurrentDrawer()
        ) {
            try {
                sendWordChoices(io, game);

                io.to(roomId).emit(
                    "game-state-updated",
                    game.getGameState()
                );

                io.to(roomId).emit("drawer-changed", {
                    drawer: {
                        id: game.getCurrentDrawer().id,
                        username: game.getCurrentDrawer().username
                    }
                });
            } catch (error) {
                console.error(
                    "Failed to prepare replacement drawer:",
                    error.message
                );
            }
        }

        // Notify players if the drawing round ended.
        else if (game.roundStatus === "round-ended") {
            io.to(roomId).emit("round-ended", {
                reason: "drawer-left",
                leaderboard: game.getLeaderboard(),
                gameState: game.getGameState()
            });
        }

        // Update game state for other departures.
        else {
            io.to(roomId).emit(
                "game-state-updated",
                game.getGameState()
            );
        }
    }

    // Broadcast updated room information.
    if (room.getPlayerCount() > 0) {
        broadcastRoomUpdate(io, room);
    }

    return {
        roomId,
        player,
        room
    };
};

module.exports = {
    getPublicRoomData,
    broadcastRoomUpdate,
    handlePlayerLeaving
};
