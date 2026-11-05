import { useCallback } from "react";
import { socket } from "../../socket/socket";

const useGameActions = () => {
    const startGame = useCallback((onError) => {
        socket.emit("start-game", (response) => {
            if (!response?.success) {
                onError?.(
                    response?.error || "Unable to start the game"
                );
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
                onError?.(
                    response?.error || "Unable to select the word"
                );
            }
        });
    }, []);

    const requestHint = useCallback(() => {
        socket.emit("request-hint");
    }, []);

    const requestGameState = useCallback((callback) => {
        socket.emit("get-game-state", callback);
    }, []);

    // Allow the host to start the next turn.
    const nextTurn = useCallback((onError) => {
        socket.emit("next-turn", (response) => {
            if (!response?.success) {
                onError?.(
                    response?.error || "Unable to start the next turn"
                );
            }
        });
    }, []);

    return {
        startGame,
        selectWord,
        requestHint,
        requestGameState,
        nextTurn
    };
};

export default useGameActions;
