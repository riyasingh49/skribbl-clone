const handleGuess = (io, room, game, player, message) => {
    if (!game || game.roundStatus !== "drawing") {
        return { isGuess: false };
    }

    const normalizedGuess = message.trim().toLowerCase();
    const normalizedWord = game.currentWord?.trim().toLowerCase();

    if (!normalizedWord) {
        return { isGuess: false };
    }

    // Prevent the drawer from guessing.
    if (game.getCurrentDrawer()?.id === player.id) {
        throw new Error("The drawer cannot guess their own word");
    }

    // Prevent duplicate correct guesses.
    if (game.hasPlayerGuessed(player.id)) {
        if (normalizedGuess === normalizedWord) {
            throw new Error("You have already guessed correctly");
        }

        return { isGuess: true, correct: false };
    }

    // Check whether the guess is correct.
    if (normalizedGuess === normalizedWord) {
        const result = game.recordCorrectGuess(player.id);

        io.to(room.id).emit("correct-guess", {
            username: player.username,
            playerId: player.id,
            word: game.currentWord,
            guesserPoints: result.guesserPoints,
            drawerUsername: result.drawerUsername,
            drawerPoints: result.drawerPoints,
            guessPosition: result.guessPosition
        });

        io.to(room.id).emit("scores-updated", {
            players: game.getLeaderboard()
        });

        return {
            isGuess: true,
            correct: true,
            result
        };
    }

    return {
        isGuess: true,
        correct: false
    };
};

module.exports = handleGuess;
