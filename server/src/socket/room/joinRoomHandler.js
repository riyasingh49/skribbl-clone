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

            const result = roomService.joinRoom(
                socket.id,
                username,
                roomId
            );

            const room = result.room;

            socket.join(room.id);

            const roomData = getPublicRoomData(room);

            // Notify everyone in the room.
            broadcastRoomUpdate(io, room);

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
