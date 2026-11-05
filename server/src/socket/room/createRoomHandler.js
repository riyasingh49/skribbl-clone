const {
    getPublicRoomData,
    broadcastRoomUpdate
} = require("./roomUtils");

const registerCreateRoomHandler = (
    io,
    socket,
    roomService
) => {

    socket.on("create-room", (data, callback) => {
        try {
            const username = data?.username;
            const settings = data?.settings || {};

            const room = roomService.createRoom(
                socket.id,
                username,
                settings
            );

            socket.join(room.id);

            const roomData = getPublicRoomData(room);

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

module.exports = registerCreateRoomHandler;
