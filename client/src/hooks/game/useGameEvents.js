
import { useEffect } from "react";
import { socket } from "../../socket/socket";

const useGameEvents = (handlers) => {
    useEffect(() => {
        const events = {
            "game-started": handlers.onGameStarted,
            "word-choices": handlers.onWordChoices,
            "drawing-started": handlers.onDrawingStarted,
            "your-word": handlers.onYourWord,
            "timer-update": handlers.onTimerUpdate,
            "hint-updated": handlers.onHintUpdated,
            "round-ended": handlers.onRoundEnded,
            "next-turn-started": handlers.onNextTurn,
            "game-state-updated": handlers.onGameStateUpdated,
            "drawer-changed": handlers.onDrawerChanged,
            "scores-updated": handlers.onScoresUpdated,
            "game-finished": handlers.onGameFinished
        };

        Object.entries(events).forEach(([event, handler]) => {
            socket.on(event, handler);
        });

        return () => {
            Object.entries(events).forEach(([event, handler]) => {
                socket.off(event, handler);
            });
        };
    }, [handlers]);
};

export default useGameEvents;
