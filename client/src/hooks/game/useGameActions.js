import { useCallback } from "react";
import { socket } from "../../socket/socket";

const useGameActions = () => {
    const startGame = useCallback((onError) => {
        socket.emit("start-game", (response) => {
            if (!response?.success) {
                onError?.(response?.error || "Unable to start the game");
            }
        });
    }, []);

    const selectWord = useCallback((word, onError) => {
        if (typeof word !== "string" || !word.trim()) {
            onError?.("Please select a valid word");
            return;
        }

        socket.emit("select-word", { word: word.trim() }, (response) => {
            if (!response?.success) {
                onError?.(response?.error || "Unable to select the word");
            }
        });
    }, []);

    const requestHint = useCallback(() => {
        socket.emit("request-hint");
    }, []);

    const requestGameState = useCallback((callback) => {
        socket.emit("get-game-state", callback);
    }, []);

    const nextTurn = useCallback((onError) => {
        socket.emit("next-turn", (response) => {
            if (!response?.success) {
                onError?.(response?.error || "Unable to start the next turn");
            }
        });
    }, []);

    // Host manually ends the current drawing round.
    const endRound = useCallback((onError) => {
        socket.emit("end-round", (response) => {
            if (!response?.success) {
                onError?.(response?.error || "Unable to end the round");
            }
        });
    }, []);

    return {
        startGame,
        selectWord,
        requestHint,
        requestGameState,
        nextTurn,
        endRound
    };
};

export default useGameActions;
