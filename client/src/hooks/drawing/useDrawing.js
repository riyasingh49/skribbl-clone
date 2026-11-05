import { useRef, useCallback } from "react";

import useCanvas from "./useCanvas";
import useDrawingHistory from "./useDrawingHistory";
import useDrawingSocket from "./useDrawingSocket";

function useDrawing({ canDraw = false } = {}) {
    const canvasRef = useRef(null);
    const lastPointRef = useRef(null);
    const activeStrokeIdRef = useRef(null);

    // Canvas rendering operations
    const {
        drawLine,
        redrawCanvas,
        clearCanvas: clearCanvasDisplay
    } = useCanvas(canvasRef);

    // Drawing history operations
    const {
        addStroke: saveStroke,
        undo: undoHistory,
        removeStroke,
        clearHistory,
        getStrokes
    } = useDrawingHistory();

    // Multiplayer drawing communication
    const {
        emitDrawing,
        emitUndo,
        emitClear
    } = useDrawingSocket({
        addStroke: saveStroke,
        removeStroke,
        clearHistory,
        getStrokes,
        drawLine,
        redrawCanvas,
        canDraw
    });

    // Start one complete mouse/touch gesture
    const startStroke = () => {
        if (!canDraw) return;

        activeStrokeIdRef.current = crypto.randomUUID();
    };

    // Finish the current gesture
    const finishStroke = () => {
        activeStrokeIdRef.current = null;
        lastPointRef.current = null;
    };

    // Save, draw and broadcast one line segment
    const addStroke = (stroke) => {
        if (!canDraw || !activeStrokeIdRef.current) return;

        const completeStroke = {
            ...stroke,
            strokeId: activeStrokeIdRef.current
        };

        saveStroke(completeStroke);

        drawLine(
            completeStroke.from,
            completeStroke.to,
            completeStroke.color,
            completeStroke.lineWidth
        );

        emitDrawing(completeStroke);
    };

    // Undo the complete most recent gesture
    const undo = () => {
        if (!canDraw) return;

        const strokeId = undoHistory();

        if (!strokeId) return;

        redrawCanvas(getStrokes());
        emitUndo(strokeId);
    };

    // Clear local and remote drawing history
    const clearCanvas = () => {
        if (!canDraw) return;

        clearHistory();
        clearCanvasDisplay();
        emitClear();
    };

    // Convert pointer coordinates into canvas coordinates
    const getCanvasPoint = useCallback((event) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) *
                (canvas.width / rect.width),
            y: (event.clientY - rect.top) *
                (canvas.height / rect.height)
        };
    }, []);

    return {
        canvasRef,
        lastPointRef,
        startStroke,
        finishStroke,
        addStroke,
        undo,
        clearCanvas,
        getCanvasPoint
    };
}

export default useDrawing;
