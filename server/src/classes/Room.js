const Player = require("./Player");

class Room {
    constructor(id, hostPlayer, settings = {}) {
        if (!id) {
            throw new Error("Room ID is required");
        }

        if (!(hostPlayer instanceof Player)) {
            throw new Error("Host must be a valid Player");
        }

        this.id = id;
        this.hostId = hostPlayer.id;
        this.players = new Map();

        const {
            maxPlayers = 8,
            totalRounds = 3,
            drawTime = 80
        } = settings;

        this.validateSettings({
            maxPlayers,
            totalRounds,
            drawTime
        });

        this.settings = {
            maxPlayers,
            totalRounds,
            drawTime
        };

        this.addPlayer(hostPlayer);
    }

    validateSettings(settings) {
        const { maxPlayers, totalRounds, drawTime } = settings;

        if (
            !Number.isInteger(maxPlayers) ||
            maxPlayers < 2 ||
            maxPlayers > 8
        ) {
            throw new Error(
                "Maximum players must be between 2 and 8"
            );
        }

        if (
            !Number.isInteger(totalRounds) ||
            totalRounds < 1 ||
            totalRounds > 10
        ) {
            throw new Error(
                "Total rounds must be between 1 and 10"
            );
        }

        if (
            !Number.isInteger(drawTime) ||
            drawTime < 30 ||
            drawTime > 180
        ) {
            throw new Error(
                "Drawing time must be between 30 and 180 seconds"
            );
        }
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

    getSettings() {
        return { ...this.settings };
    }
}

module.exports = Room;
