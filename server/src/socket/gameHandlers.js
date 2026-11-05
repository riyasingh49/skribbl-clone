const registerGameStartHandler = require("./game/gameStartHandler");
const registerWordSelectionHandler = require("./game/wordSelectionHandler");
const registerRoundHandler = require("./game/roundHandler");
const registerGameStateHandler = require("./game/gameStateHandler");

const registerGameHandlers = (io, socket, roomService, gameService) => {

    registerGameStartHandler(
        io,
        socket,
        roomService,
        gameService
    );

    registerWordSelectionHandler(
        io,
        socket,
        roomService,
        gameService
    );

    registerRoundHandler(
        io,
        socket,
        roomService,
        gameService
    );

    registerGameStateHandler(
        io,
        socket,
        roomService,
        gameService
    );
};

module.exports = registerGameHandlers;
