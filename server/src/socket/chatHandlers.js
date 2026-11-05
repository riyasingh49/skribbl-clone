const registerMessageHandler = require("./chat/messageHandler");
const registerHintHandler = require("./chat/hintHandler");

const registerChatHandlers = (
    io,
    socket,
    roomService,
    gameService
) => {

    registerMessageHandler(
        io,
        socket,
        roomService,
        gameService
    );

    registerHintHandler(
        io,
        socket,
        roomService,
        gameService
    );
};

module.exports = registerChatHandlers;
