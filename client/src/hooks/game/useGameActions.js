import { useCallback } from "react";
import { socket } from "../../socket/socket";

const useGameActions = () => {
    const startGame = useCallback((onError) => {
        socket.emit("start-game", (response) => {
            if (!response?.success) {
                onError?.(response?.message || "Unable to start the game");
            }
        });
    }, []);

    const selectWord = useCallback((word) => {
        if (typeof word !== "string" || !word.trim()) return;

        socket.emit("select-word", {
            word: word.trim()
        });
    }, []);

    const requestHint = useCallback(() => {
        socket.emit("request-hint");
    }, []);

    const requestGameState = useCallback((callback) => {
        socket.emit("get-game-state", callback);
    }, []);

    return {
        startGame,
        selectWord,
        requestHint,
        requestGameState
    };
};

export default useGameActions;
