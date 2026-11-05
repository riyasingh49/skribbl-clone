import { useEffect, useCallback } from "react";
import { socket } from "../../socket/socket";

function useDrawingSocket({
    addStroke,
    removeStroke,
    clearHistory,
    getStrokes,
    drawLine,
    redrawCanvas,
    canDraw
}) {
    // Send a drawing segment to other players
    const emitDrawing = useCallback((stroke) => {
        if (!canDraw) return;

        socket.emit("draw-line", stroke);
    }, [canDraw]);

    // Send an undo event to other players
    const emitUndo = useCallback((strokeId) => {
        if (!canDraw || !strokeId) return;

        socket.emit("undo-drawing", { strokeId });
    }, [canDraw]);

    // Send a clear-canvas event to other players
    const emitClear = useCallback(() => {
        if (!canDraw) return;

        socket.emit("clear-canvas");
    }, [canDraw]);

    // Listen for drawing events from other players
    useEffect(() => {
        const handleRemoteDrawing = (stroke) => {
            addStroke(stroke);

            drawLine(
                stroke.from,
                stroke.to,
                stroke.color,
                stroke.lineWidth
            );
        };

        const handleRemoteUndo = ({ strokeId } = {}) => {
            if (!strokeId) return;

            removeStroke(strokeId);
            redrawCanvas(getStrokes());
        };

        const handleRemoteClear = () => {
            clearHistory();
            redrawCanvas([]);
        };

        socket.on("draw-line", handleRemoteDrawing);
        socket.on("undo-drawing", handleRemoteUndo);
        socket.on("clear-canvas", handleRemoteClear);

        return () => {
            socket.off("draw-line", handleRemoteDrawing);
            socket.off("undo-drawing", handleRemoteUndo);
            socket.off("clear-canvas", handleRemoteClear);
        };
    }, [
        addStroke,
        removeStroke,
        clearHistory,
        getStrokes,
        drawLine,
        redrawCanvas
    ]);

    return {
        emitDrawing,
        emitUndo,
        emitClear
    };
}

export default useDrawingSocket;
