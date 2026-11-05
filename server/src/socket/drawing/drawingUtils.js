const validateDrawingRequest = (
    socket,
    roomService,
    gameService
) => {
    const room = roomService.getRoomForSocket(socket.id);

    if (!room) {
        throw new Error("You are not in a room");
    }

    const game = gameService.getGame(room.id);

    if (!game || game.roundStatus !== "drawing") {
        throw new Error("Drawing is not active");
    }

    const drawer = game.getCurrentDrawer();

    if (!drawer || drawer.id !== socket.id) {
        throw new Error("Only the current drawer can draw");
    }

    return { room, game };
};

const isValidCoordinate = (value) => {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 10000
    );
};

module.exports = {
    validateDrawingRequest,
    isValidCoordinate
};
