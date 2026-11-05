import { useState, useCallback } from "react";

const useGameState = () => {
    const [gameData, setGameData] = useState(null);
    const [wordChoices, setWordChoices] = useState([]);
    const [myWord, setMyWord] = useState(null);
    const [remainingTime, setRemainingTime] = useState(0);
    const [isChoosingWord, setIsChoosingWord] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [finishData, setFinishData] = useState(null);

    // Reset all game-related state.
    const resetGame = useCallback(() => {
        setGameData(null);
        setWordChoices([]);
        setMyWord(null);
        setRemainingTime(0);
        setIsChoosingWord(false);
        setGameFinished(false);
        setFinishData(null);
    }, []);

    return {
        gameData,
        setGameData,
        wordChoices,
        setWordChoices,
        myWord,
        setMyWord,
        remainingTime,
        setRemainingTime,
        isChoosingWord,
        setIsChoosingWord,
        gameFinished,
        setGameFinished,
        finishData,
        setFinishData,
        resetGame
    };
};

export default useGameState;
