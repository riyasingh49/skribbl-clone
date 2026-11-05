const { validateDrawingRequest } = require("./drawingUtils");
const registerUndoHandler = (
    io,
    socket,
    roomService,
    gameService
) => {

    socket.on("undo-drawing", (data, callback) => {
        try {
            const { room } = validateDrawingRequest(
                socket,
                roomService,
                gameService
            );

            const strokeId = data?.strokeId;

            if (
                typeof strokeId !== "string" ||
                !strokeId.trim() ||
                strokeId.length > 100
            ) {
                throw new Error("Invalid stroke ID");
            }

            socket.to(room.id).emit("undo-drawing", {
                strokeId
            });

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

module.exports = registerUndoHandler;
