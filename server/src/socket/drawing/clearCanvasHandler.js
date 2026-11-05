const { validateDrawingRequest } = require("./drawingUtils");
const registerClearCanvasHandler = (
    io,
    socket,
    roomService,
    gameService
) => {

    socket.on("clear-canvas", (callback) => {
        try {
            const { room } = validateDrawingRequest(
                socket,
                roomService,
                gameService
            );

            socket.to(room.id).emit("clear-canvas");

            if (typeof callback === "function") {
                callback({ success: true });
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

module.exports = registerClearCanvasHandler;
