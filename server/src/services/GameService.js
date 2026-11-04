class GameService {
    constructor() {
        this.activeGames = new Map();
    }

    createGame(roomId, game) {
        if (this.activeGames.has(roomId)) {
            throw new Error("Game already exists for this room");
        }

        this.activeGames.set(roomId, game);
        return game;
    }

    getGame(roomId) {
        return this.activeGames.get(roomId) || null;
    }

    hasGame(roomId) {
        return this.activeGames.has(roomId);
    }

    removeGame(roomId) {
        return this.activeGames.delete(roomId);
    }
}

module.exports = GameService;