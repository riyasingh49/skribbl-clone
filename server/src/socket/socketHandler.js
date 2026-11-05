const RoomService = require("../services/RoomService");
const GameService = require("../services/GameService");

const registerRoomHandlers = require("./roomHandlers");
const registerGameHandlers = require("./gameHandlers");
const registerDrawingHandlers = require("./drawingHandlers");
const registerChatHandlers = require("./chatHandlers");

const roomService = new RoomService();
const gameService = new GameService();

const registerSocketHandlers = (io) => {

    io.on("connection", (socket) => {
        console.log("Player connected:", socket.id);

        registerRoomHandlers(
            io,
            socket,
            roomService,
            gameService
        );

        registerGameHandlers(
            io,
            socket,
            roomService,
            gameService
        );

        registerDrawingHandlers(
            io,
            socket,
            roomService,
            gameService
        );

        registerChatHandlers(
            io,
            socket,
            roomService,
            gameService
        );
    });
};

module.exports = registerSocketHandlers;
