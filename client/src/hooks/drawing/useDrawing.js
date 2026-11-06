import { useRef, useCallback } from "react";
import useCanvas from "./useCanvas";
import useDrawingHistory from "./useDrawingHistory";
import useDrawingSocket from "./useDrawingSocket";

function useDrawing({ canDraw = false } = {}) {
    const canvasRef = useRef(null);
    const lastPointRef = useRef(null);
    const activeStrokeIdRef = useRef(null);

    const {
        drawLine,
        redrawCanvas,
        clearCanvas: clearCanvasDisplay
    } = useCanvas(canvasRef);

    const {
        addStroke: saveStroke,
        undo: undoHistory,
        removeStroke,
        clearHistory,
        getStrokes
    } = useDrawingHistory();

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

    const startStroke = () => {
        if (!canDraw) return;

        activeStrokeIdRef.current = crypto.randomUUID();
    };

    const finishStroke = () => {
        activeStrokeIdRef.current = null;
        lastPointRef.current = null;
    };

    const addStroke = (stroke) => {
        if (!canDraw || !activeStrokeIdRef.current) return;

        const completeStroke = {
            ...stroke,
            isErasing: Boolean(stroke.isErasing),
            strokeId: activeStrokeIdRef.current
        };

        saveStroke(completeStroke);

        drawLine(
            completeStroke.from,
            completeStroke.to,
            completeStroke.color,
            completeStroke.lineWidth,
            completeStroke.isErasing
        );

        emitDrawing(completeStroke);
    };

    const undo = () => {
        if (!canDraw) return;

        const strokeId = undoHistory();

        if (!strokeId) return;

        redrawCanvas(getStrokes());
        emitUndo(strokeId);
    };

    const clearCanvas = () => {
        if (!canDraw) return;

        clearHistory();
        clearCanvasDisplay();
        emitClear();
    };

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
