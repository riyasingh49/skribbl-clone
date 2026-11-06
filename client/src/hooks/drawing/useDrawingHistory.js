import { useRef, useCallback } from "react";

function useDrawingHistory() {
    const strokesRef = useRef([]);

    // Save one line segment.
    const addStroke = useCallback((stroke) => {
        if (!stroke || !stroke.strokeId) return;

        strokesRef.current = [
            ...strokesRef.current,
            stroke
        ];
    }, []);

    // Undo the most recent complete drawing gesture.
    const undo = useCallback(() => {
        const strokes = strokesRef.current;

        if (strokes.length === 0) {
            return null;
        }

        const lastStroke = strokes[strokes.length - 1];
        const strokeId = lastStroke.strokeId;

        if (!strokeId) return null;

        strokesRef.current = strokes.filter(
            (stroke) => stroke.strokeId !== strokeId
        );

        return strokeId;
    }, []);

    // Remove a complete gesture by its ID.
    const removeStroke = useCallback((strokeId) => {
        if (!strokeId) return;

        strokesRef.current = strokesRef.current.filter(
            (stroke) => stroke.strokeId !== strokeId
        );
    }, []);

    // Remove all drawing history.
    const clearHistory = useCallback(() => {
        strokesRef.current = [];
    }, []);

    // Return a copy so callers cannot mutate internal history.
    const getStrokes = useCallback(() => {
        return [...strokesRef.current];
    }, []);

    return {
        addStroke,
        undo,
        removeStroke,
        clearHistory,
        getStrokes
    };
}

export default useDrawingHistory;
