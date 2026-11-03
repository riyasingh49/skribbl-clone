class Player {
    constructor(id, username) {
        this.id = id;
        this.username = username;
        this.score = 0;
    }

    addPoints(points) {
        if (!Number.isFinite(points) || points < 0) {
            throw new Error("Points must be a non-negative number");
        }

        this.score += points;
    }

    resetScore() {
        this.score = 0;
    }
}

module.exports = Player;
