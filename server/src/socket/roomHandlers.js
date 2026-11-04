const registerRoomHandlers = (io, socket, roomService) => {

    // Convert Room instance into client-friendly data
    const serializeRoom = (room) => ({
        id: room.id,
        hostId: room.hostId,
        players: room.getPlayers().map((player) => ({
            id: player.id,
            username: player.username,
            score: player.score
        })),
        settings: room.settings
    });

    // Shared cleanup logic for voluntary leave and disconnect
    const removePlayerFromRoom = async (isDisconnect = false) => {
        const result = roomService.leaveRoom(socket.id);

        // Player was not in a room
        if (!result) {
            return null;
        }

        const { room, player, roomId } = result;

        // On disconnect, Socket.IO handles room removal automatically.
        if (!isDisconnect) {
            await socket.leave(roomId);
        }

        // Notify remaining players if the room still exists
        if (room.getPlayerCount() > 0) {
            io.to(roomId).emit("player-left", {
                id: player.id,
                username: player.username
            });

            io.to(roomId).emit(
                "room-updated",
                serializeRoom(room)
            );
        }

        return {
            roomId,
            player
        };
    };

    // CREATE ROOM
    socket.on("create-room", async (data, callback) => {
        try {
            const { username, settings } = data || {};

            const room = roomService.createRoom(
                socket.id,
                username,
                settings
            );

            await socket.join(room.id);

            const roomData = serializeRoom(room);

            io.to(room.id).emit("room-updated", roomData);

            if (typeof callback === "function") {
                callback({
                    success: true,
                    room: roomData
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

    // JOIN ROOM
    socket.on("join-room", async (data, callback) => {
        try {
            const { username, roomId } = data || {};

            const { room, player } = roomService.joinRoom(
                socket.id,
                username,
                roomId
            );

            await socket.join(room.id);

            io.to(room.id).emit("player-joined", {
                id: player.id,
                username: player.username,
                score: player.score
            });

            const roomData = serializeRoom(room);

            io.to(room.id).emit("room-updated", roomData);

            if (typeof callback === "function") {
                callback({
                    success: true,
                    room: roomData
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

    // LEAVE ROOM
    socket.on("leave-room", async (callback) => {
        try {
            const result = await removePlayerFromRoom();

            if (typeof callback === "function") {
                callback({
                    success: true,
                    roomId: result?.roomId || null
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

    // AUTOMATIC DISCONNECT CLEANUP
    socket.on("disconnect", async () => {
        const result = await removePlayerFromRoom(true);

        if (result) {
            console.log(
                `${result.player.username} left room ${result.roomId} after disconnect`
            );
        }
    });
};

module.exports = registerRoomHandlers;
