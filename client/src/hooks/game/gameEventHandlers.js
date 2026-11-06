const createGameEventHandlers = (state) => {
    const {
        setGameData,
        setWordChoices,
        setMyWord,
        setRemainingTime,
        setIsChoosingWord,
        setGameFinished,
        setFinishData
    } = state;

    return {
        onGameStarted: (data) => {
            setGameData(data);
            setGameFinished(false);
            setFinishData(null);
            setMyWord(null);
            setRemainingTime(0);
        },

        onWordChoices: (choices) => {
            setWordChoices(choices);
            setIsChoosingWord(true);
            setMyWord(null);
        },

        onDrawingStarted: (data) => {
            setIsChoosingWord(false);
            setWordChoices([]);
            setRemainingTime(data.drawTime || 80);

            setGameData(previous => ({
                ...previous,
                ...(data.gameState || data),
                roundStatus: "drawing",
                correctWord: null
            }));
        },

        onYourWord: (data) => {
            const word = typeof data === "string"
                ? data
                : data?.word;

            setMyWord(word || null);
        },

        onTimerUpdate: (data) => {
            const time = typeof data === "number"
                ? data
                : data.remainingTime ?? data.time;

            if (Number.isFinite(time)) {
                setRemainingTime(time);
            }
        },

        onHintUpdated: (data) => {
            const hint = typeof data === "string"
                ? data
                : data.hint;

            if (typeof hint === "string") {
                setGameData(previous => ({
                    ...previous,
                    hint
                }));
            }
        },

        onRoundEnded: (data) => {
            setIsChoosingWord(false);
            setWordChoices([]);
            setMyWord(null);
            setRemainingTime(0);

            setGameData(previous => ({
                ...previous,
                ...(data.gameState || {}),
                roundStatus: "round-ended",
                correctWord: data.correctWord || null,
                leaderboard: data.leaderboard ||
                    data.gameState?.leaderboard ||
                    previous?.leaderboard ||
                    []
            }));
        },

        onNextTurn: (data) => {
            setIsChoosingWord(false);
            setWordChoices([]);
            setMyWord(null);

            setGameData(previous => ({
                ...previous,
                ...(data.gameState || data),
                correctWord: null
            }));
        },

        onGameStateUpdated: (data) => {
            setGameData(previous => ({
                ...previous,
                ...data,
                correctWord: data.roundStatus === "round-ended"
                    ? previous?.correctWord
                    : null
            }));

            if (data.roundStatus !== "selecting-word") {
                setIsChoosingWord(false);
                setWordChoices([]);
            }
        },

        onDrawerChanged: (data) => {
            setGameData(previous => ({
                ...previous,
                drawer: data.drawer
            }));
        },

        onScoresUpdated: (data) => {
            setGameData(previous => ({
                ...previous,
                leaderboard: data.players || data.leaderboard || []
            }));
        },

        onGameFinished: (data) => {
            setGameFinished(true);
            setFinishData(data);

            setGameData(previous => ({
                ...previous,
                ...(data.gameState || {}),
                roundStatus: "finished",
                leaderboard: data.leaderboard ||
                    data.gameState?.leaderboard ||
                    previous?.leaderboard ||
                    []
            }));

            setIsChoosingWord(false);
            setWordChoices([]);
            setMyWord(null);
            setRemainingTime(0);
        }
    };
};

export default createGameEventHandlers;
