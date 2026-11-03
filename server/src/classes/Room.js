const Player = require("./Player");

class Room {
    constructor(id, hostPlayer, settings = {}) {
        if (!(hostPlayer instanceof Player)) {
            throw new Error("Host must be a valid Player");
        }

        this.id = id;
        this.hostId = hostPlayer.id;

        // Store players using their unique IDs
        this.players = new Map();

        // Default game settings
        this.settings = {
            maxPlayers: 8,
            totalRounds: 3,
            drawTime: 80,
            ...settings
        };

        // The room creator is automatically added
        this.addPlayer(hostPlayer);
    }

    addPlayer(player) {
        if (!(player instanceof Player)) {
            throw new Error("Invalid player");
        }

        if (this.players.has(player.id)) {
            throw new Error("Player already exists in this room");
        }

        if (this.isFull()) {
            throw new Error("Room is full");
        }

        this.players.set(player.id, player);
    }

    removePlayer(playerId) {
        const player = this.players.get(playerId);

        if (!player) {
            return null;
        }

        this.players.delete(playerId);

        // Transfer host privileges if the host leaves
        if (this.hostId === playerId) {
            const nextPlayer = this.players.values().next().value;
            this.hostId = nextPlayer ? nextPlayer.id : null;
        }

        return player;
    }

    getPlayers() {
        return Array.from(this.players.values());
    }

    getPlayerCount() {
        return this.players.size;
    }

    isFull() {
        return this.players.size >= this.settings.maxPlayers;
    }
}

module.exports = Room;
