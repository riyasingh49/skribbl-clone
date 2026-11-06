const {
    getPublicRoomData,
    broadcastRoomUpdate
} = require("./roomUtils");

const registerJoinRoomHandler = (
    io,
    socket,
    roomService
) => {
    socket.on("join-room", (data, callback) => {
        try {
            const username = data?.username;
            const roomId = data?.roomId;
            const password = data?.password || "";

            if (!username || !roomId) {
                throw new Error("Username and room ID are required");
            }

            const room = roomService.getRoom(
                roomId.trim().toUpperCase()
            );

            if (!room) {
                throw new Error("Room not found");
            }

            if (room.isPrivate && !room.verifyPassword(password)) {
                throw new Error("Incorrect room password");
            }

            const result = roomService.joinRoom(
                socket.id,
                username,
                roomId
            );

            socket.join(result.room.id);

            const roomData = getPublicRoomData(result.room);

            broadcastRoomUpdate(io, result.room);

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
};

module.exports = registerJoinRoomHandler;
