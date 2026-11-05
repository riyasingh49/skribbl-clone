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

// Shared cleanup for voluntary leaves and unexpected disconnects.
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
        return null;
    }

    const game = gameService.getGame(roomId);

    // Remove the player from the game before removing them from the room.
    // This lets Game identify whether the departing player was drawing.
    if (game) {
        game.removePlayer(socket.id);
    }

    const result = roomService.leaveRoom(socket.id);

    if (!result) {
        return null;
    }

    socket.leave(roomId);

    io.to(roomId).emit("player-left", {
        id: player.id,
        username: player.username
    });

    if (game && room.getPlayerCount() < 2) {
        game.endGame();

        io.to(roomId).emit("game-finished", {
            winner: game.getWinner(),
            leaderboard: game.getLeaderboard(),
            reason: "not-enough-players"
        });

        gameService.removeGame(roomId);
    } else if (game && game.roundStatus === "round-ended") {
        io.to(roomId).emit("round-ended", {
            reason: "drawer-left",
            leaderboard: game.getLeaderboard()
        });

        io.to(roomId).emit(
            "game-state-updated",
            game.getGameState()
        );
    }

    // An empty room has already been deleted by RoomService.
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
