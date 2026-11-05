const registerCreateRoomHandler = require("./room/createRoomHandler");
const registerJoinRoomHandler = require("./room/joinRoomHandler");
const registerLeaveRoomHandler = require("./room/leaveRoomHandler");
const registerDisconnectHandler = require("./room/disconnectHandler");

const registerRoomHandlers = (
    io,
    socket,
    roomService,
    gameService
) => {

    registerCreateRoomHandler(
        io,
        socket,
        roomService
    );

    registerJoinRoomHandler(
        io,
        socket,
        roomService
    );

    registerLeaveRoomHandler(
        io,
        socket,
        roomService,
        gameService
    );

    registerDisconnectHandler(
        io,
        socket,
        roomService,
        gameService
    );
};

module.exports = registerRoomHandlers;
