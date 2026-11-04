const RoomService = require("../src/services/RoomService");

const roomService = new RoomService();

// Create a room
const room = roomService.createRoom(
    "socket-101",
    "Riya",
    { maxPlayers: 4 }
);

console.log("Created room:", room.id);
console.log("Host:", room.hostId);

// Join the room
const result = roomService.joinRoom(
    "socket-102",
    "Alex",
    room.id
);

console.log("Joined player:", result.player.username);
console.log("Player count:", room.getPlayerCount());

// Check socket mapping
console.log(
    "Alex's room:",
    roomService.getRoomForSocket("socket-102").id
);

// Remove the host
roomService.leaveRoom("socket-101");

console.log("New host:", room.hostId);
console.log("Remaining players:", room.getPlayerCount());

// Remove the last player
roomService.leaveRoom("socket-102");

console.log("Room after everyone leaves:", roomService.getRoom(room.id));
