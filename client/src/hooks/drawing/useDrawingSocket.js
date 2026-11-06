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
    // Send drawing data to the server.
    const emitDrawing = useCallback((stroke) => {
        if (!canDraw) return;

        socket.emit("draw-line", {
            fromX: stroke.from.x,
            fromY: stroke.from.y,
            toX: stroke.to.x,
            toY: stroke.to.y,
            color: stroke.color,
            width: stroke.lineWidth,
            strokeId: stroke.strokeId,
            isErasing: Boolean(stroke.isErasing)
        });
    }, [canDraw]);

    const emitUndo = useCallback((strokeId) => {
        if (!canDraw || !strokeId) return;

        socket.emit("undo-drawing", { strokeId });
    }, [canDraw]);

    const emitClear = useCallback(() => {
        if (!canDraw) return;

        socket.emit("clear-canvas");
    }, [canDraw]);

    // Receive drawing data from other players.
    useEffect(() => {
        const handleRemoteDrawing = (data) => {
            if (!data) return;

            const stroke = {
                from: {
                    x: data.fromX,
                    y: data.fromY
                },
                to: {
                    x: data.toX,
                    y: data.toY
                },
                color: data.color,
                lineWidth: data.width,
                strokeId: data.strokeId,
                isErasing: Boolean(data.isErasing)
            };

            addStroke(stroke);

            drawLine(
                stroke.from,
                stroke.to,
                stroke.color,
                stroke.lineWidth,
                stroke.isErasing
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
