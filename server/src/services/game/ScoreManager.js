class ScoreManager {
    constructor(room) {
        this.room = room;
        this.correctGuessers = new Set();
        this.guessOrder = [];
        this.drawerBonus = 50;

        this.guesserPoints = [100, 80, 60, 40];
        this.additionalGuesserPoints = 20;
    }

    recordCorrectGuess(playerId, drawerId) {
        const player = this.room.players.get(playerId);
        const drawer = this.room.players.get(drawerId);

        if (!player) {
            throw new Error("Player not found in room");
        }

        if (!drawer) {
            throw new Error("Drawer not found in room");
        }

        if (playerId === drawerId) {
            throw new Error("Drawer cannot guess their own word");
        }

        if (this.correctGuessers.has(playerId)) {
            throw new Error("Player has already guessed correctly");
        }

        const guessPosition = this.guessOrder.length;

        const points =
            this.guesserPoints[guessPosition] ??
            this.additionalGuesserPoints;

        player.addPoints(points);
        drawer.addPoints(this.drawerBonus);

        this.correctGuessers.add(playerId);
        this.guessOrder.push(playerId);

        return {
            playerId: player.id,
            username: player.username,
            guesserPoints: points,
            drawerId: drawer.id,
            drawerUsername: drawer.username,
            drawerPoints: this.drawerBonus,
            guessPosition: guessPosition + 1,
        };
    }

    hasGuessedCorrectly(playerId) {
        return this.correctGuessers.has(playerId);
    }

    getCorrectGuessCount() {
        return this.correctGuessers.size;
    }

    getLeaderboard() {
        return this.room.getPlayers()
            .map((player) => ({
                id: player.id,
                username: player.username,
                score: player.score,
            }))
            .sort((a, b) => b.score - a.score);
    }

    getWinner() {
        const leaderboard = this.getLeaderboard();

        if (leaderboard.length === 0) {
            return null;
        }

        return leaderboard[0];
    }

    resetRound() {
        this.correctGuessers.clear();
        this.guessOrder = [];
    }

    resetAllScores() {
        this.room.getPlayers().forEach((player) => {
            player.resetScore();
        });

        this.resetRound();
    }
}

module.exports = ScoreManager;
