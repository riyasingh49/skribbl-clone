import { useState, useEffect, useCallback } from "react";
import { socket } from "../../socket/socket";

function useGame() {
    const [gameData, setGameData] = useState(null);
    const [wordChoices, setWordChoices] = useState([]);
    const [isChoosingWord, setIsChoosingWord] = useState(false);

    useEffect(() => {
        const handleGameStarted = (game) => {
            console.log("Game started:", game);
            setGameData(game);
        };

        const handleWordChoices = (choices) => {
            setWordChoices(choices);
            setIsChoosingWord(true);
        };

        const handleDrawingStarted = (data) => {
            setGameData((previous) => ({
                ...previous,
                ...data,
                drawer: data.drawer,
            }));

            setIsChoosingWord(false);
            setWordChoices([]);
        };

        const handleYourWord = (data) => {
            console.log("Your selected word:", data.word);
        };

        socket.on("game-started", handleGameStarted);
        socket.on("word-choices", handleWordChoices);
        socket.on("drawing-started", handleDrawingStarted);
        socket.on("your-word", handleYourWord);

        return () => {
            socket.off("game-started", handleGameStarted);
            socket.off("word-choices", handleWordChoices);
            socket.off("drawing-started", handleDrawingStarted);
            socket.off("your-word", handleYourWord);
        };
    }, []);

    const startGame = useCallback((onError) => {
        socket.emit("start-game", (response) => {
            if (!response?.success) {
                onError(response?.error || "Could not start the game");
            }
        });
    }, []);

    const selectWord = useCallback((word, onError) => {
        socket.emit("select-word", { word }, (response) => {
            if (response?.success) {
                setIsChoosingWord(false);
                setWordChoices([]);
            } else {
                onError(response?.error || "Could not select that word");
            }
        });
    }, []);

    return {
        gameData,
        setGameData,
        wordChoices,
        isChoosingWord,
        startGame,
        selectWord,
    };
}

export default useGame;