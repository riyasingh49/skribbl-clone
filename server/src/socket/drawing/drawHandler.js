const {
    validateDrawingRequest,
    isValidCoordinate
} = require("./drawingUtils");

const registerDrawHandler = (
    io,
    socket,
    roomService,
    gameService
) => {
    socket.on("draw-line", (data, callback) => {
        try {
            const { room } = validateDrawingRequest(
                socket,
                roomService,
                gameService
            );

            if (!data || typeof data !== "object") {
                throw new Error("Invalid drawing data");
            }

            const {
                fromX,
                fromY,
                toX,
                toY,
                color,
                width,
                strokeId,
                isErasing = false
            } = data;

            if (
                !isValidCoordinate(fromX) ||
                !isValidCoordinate(fromY) ||
                !isValidCoordinate(toX) ||
                !isValidCoordinate(toY)
            ) {
                throw new Error("Invalid drawing coordinates");
            }

            if (
                typeof color !== "string" ||
                !/^#[0-9a-fA-F]{6}$/.test(color)
            ) {
                throw new Error("Invalid drawing color");
            }

            if (
                typeof width !== "number" ||
                !Number.isFinite(width) ||
                width < 1 ||
                width > 100
            ) {
                throw new Error("Invalid brush size");
            }

            if (
                typeof strokeId !== "string" ||
                !strokeId.trim() ||
                strokeId.length > 100
            ) {
                throw new Error("Invalid stroke ID");
            }

            if (typeof isErasing !== "boolean") {
                throw new Error("Invalid eraser setting");
            }

            socket.to(room.id).emit("draw-line", {
                fromX,
                fromY,
                toX,
                toY,
                color,
                width,
                strokeId,
                isErasing
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

module.exports = registerDrawHandler;
