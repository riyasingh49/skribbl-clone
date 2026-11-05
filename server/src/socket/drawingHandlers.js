const registerDrawHandler = require("./drawing/drawHandler");
const registerUndoHandler = require("./drawing/undoHandler");
const registerClearCanvasHandler = require("./drawing/clearCanvasHandler");

const registerDrawingHandlers = (
    io,
    socket,
    roomService,
    gameService
) => {

    registerDrawHandler(
        io,
        socket,
        roomService,
        gameService
    );

    registerUndoHandler(
        io,
        socket,
        roomService,
        gameService
    );

    registerClearCanvasHandler(
        io,
        socket,
        roomService,
        gameService
    );
};

module.exports = registerDrawingHandlers;
