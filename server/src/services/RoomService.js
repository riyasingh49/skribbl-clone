const { randomBytes } = require("crypto");

const Player = require("../classes/Player");
const Room = require("../classes/Room");

class RoomService {
    constructor() {
        // Stores all active rooms
        this.rooms = new Map();

        // Tracks which room each socket belongs to
        this.socketRooms = new Map();
    }

    generateRoomId() {
        let roomId;

        do {
            roomId = randomBytes(3).toString("hex").toUpperCase();
        } while (this.rooms.has(roomId));

        return roomId;
    }

    createRoom(socketId, username, settings = {}) {
        if (this.socketRooms.has(socketId)) {
            throw new Error("Player is already in a room");
        }

        if (typeof username !== "string" || !username.trim()) {
            throw new Error("Valid username is required");
        }

        const roomId = this.generateRoomId();

        // Creator automatically becomes the host
        const hostPlayer = new Player(socketId, username.trim());

        const room = new Room(roomId, hostPlayer, settings);

        this.rooms.set(roomId, room);
        this.socketRooms.set(socketId, roomId);

        return room;
    }

    joinRoom(socketId, username, roomId) {
        if (this.socketRooms.has(socketId)) {
            throw new Error("Player is already in a room");
        }

        if (typeof username !== "string" || !username.trim()) {
            throw new Error("Valid username is required");
        }

        if (typeof roomId !== "string" || !roomId.trim()) {
            throw new Error("Valid room ID is required");
        }

        const normalizedRoomId = roomId.trim().toUpperCase();
        const room = this.rooms.get(normalizedRoomId);

        if (!room) {
            throw new Error("Room not found");
        }

        const player = new Player(socketId, username.trim());

        room.addPlayer(player);
        this.socketRooms.set(socketId, normalizedRoomId);

        return {
            room,
            player
        };
    }

    leaveRoom(socketId) {
        const roomId = this.socketRooms.get(socketId);

        if (!roomId) {
            return null;
        }

        const room = this.rooms.get(roomId);

        this.socketRooms.delete(socketId);

        if (!room) {
            return null;
        }

        const player = room.removePlayer(socketId);

        // Delete empty rooms to prevent stale room data
        if (room.getPlayerCount() === 0) {
            this.rooms.delete(roomId);
        }

        return {
            room,
            player,
            roomId
        };
    }

    getRoom(roomId) {
        return this.rooms.get(roomId) || null;
    }

    getRoomForSocket(socketId) {
        const roomId = this.socketRooms.get(socketId);

        if (!roomId) {
            return null;
        }

        return this.getRoom(roomId);
    }
}

module.exports = RoomService;
