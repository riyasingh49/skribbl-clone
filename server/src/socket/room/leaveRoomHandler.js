const { handlePlayerLeaving } = require("./roomUtils");

const registerLeaveRoomHandler = (
    io,
    socket,
    roomService,
    gameService
) => {

    socket.on("leave-room", (callback) => {
        try {
            const result = handlePlayerLeaving(
                io,
                socket,
                roomService,
                gameService
            );

            if (!result) {
                throw new Error("You are not in a room");
            }

            if (typeof callback === "function") {
                callback({
                    success: true,
                    message: "You left the room successfully"
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

module.exports = registerLeaveRoomHandler;
