const Player = require("./src/classes/Player");
const Room = require("./src/classes/Room");

const player1 = new Player("101", "Riya");
const player2 = new Player("102", "Alex");
const player3 = new Player("103", "Sam");

// Create room with Riya as host
const room = new Room("ABC123", player1);

console.log("Room ID:", room.id);
console.log("Initial host:", room.hostId);

// Add two more players
room.addPlayer(player2);
room.addPlayer(player3);

console.log("Players:", room.getPlayers().map(p => p.username));
console.log("Player count:", room.getPlayerCount());
console.log("Is room full?", room.isFull());

// Remove the host
room.removePlayer("101");

console.log("New host:", room.hostId);
console.log("Remaining players:", room.getPlayerCount());
