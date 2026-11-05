import { useMemo } from "react";

import useGameState from "./useGameState";
import useGameEvents from "./useGameEvents";
import useGameActions from "./useGameActions";
import createGameEventHandlers from "./gameEventHandlers";

const useGame = () => {
    const gameState = useGameState();

    // Create stable event handlers.
    const eventHandlers = useMemo(
        () => createGameEventHandlers(gameState),
        [
            gameState.setGameData,
            gameState.setWordChoices,
            gameState.setMyWord,
            gameState.setRemainingTime,
            gameState.setIsChoosingWord,
            gameState.setGameFinished,
            gameState.setFinishData
        ]
    );

    // Register incoming socket events.
    useGameEvents(eventHandlers);

    // Get outgoing game actions.
    const gameActions = useGameActions();

    return {
        ...gameState,
        ...gameActions
    };
};

export default useGame;
