import { useRef, useCallback } from "react";

function useDrawingHistory() {
    const strokesRef = useRef([]);

    // Add a line segment to drawing history
    const addStroke = useCallback((stroke) => {
        strokesRef.current = [
            ...strokesRef.current,
            stroke
        ];
    }, []);

    // Remove the most recent complete drawing gesture
    const undo = useCallback(() => {
        if (strokesRef.current.length === 0) {
            return null;
        }

        const lastStroke =
            strokesRef.current[strokesRef.current.length - 1];

        const strokeId = lastStroke.strokeId;

        strokesRef.current = strokesRef.current.filter(
            (stroke) => stroke.strokeId !== strokeId
        );

        return strokeId;
    }, []);

    // Remove a specific drawing gesture
    const removeStroke = useCallback((strokeId) => {
        strokesRef.current = strokesRef.current.filter(
            (stroke) => stroke.strokeId !== strokeId
        );
    }, []);

    // Clear all drawing history
    const clearHistory = useCallback(() => {
        strokesRef.current = [];
    }, []);

    // Get the current drawing history
    const getStrokes = useCallback(() => {
        return strokesRef.current;
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
