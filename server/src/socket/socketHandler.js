const RoomService = require("../services/RoomService");
const registerRoomHandlers = require("./roomHandlers");

// One shared RoomService instance for all connected players
const roomService = new RoomService();

const registerSocketHandlers = (io) => {
    io.on("connection", (socket) => {
        console.log("Player connected:", socket.id);

        // Register room-related events
        registerRoomHandlers(io, socket, roomService);

        socket.on("disconnect", () => {
            console.log("Player disconnected:", socket.id);
        });
    });
};

module.exports = registerSocketHandlers;
