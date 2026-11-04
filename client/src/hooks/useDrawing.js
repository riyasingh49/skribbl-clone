import { useRef, useEffect, useCallback } from "react";
import { socket } from "../socket/socket";

function useDrawing() {
    const canvasRef = useRef(null);
    const strokesRef = useRef([]);
    const lastPointRef = useRef(null);

    // Draw a line on the canvas
    const drawLine = useCallback((from, to, color, lineWidth) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");

        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);

        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = "round";
        context.lineJoin = "round";

        context.stroke();
    }, []);

    // Redraw all saved strokes
    const redrawCanvas = useCallback((strokeList) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        strokeList.forEach((stroke) => {
            drawLine(
                stroke.from,
                stroke.to,
                stroke.color,
                stroke.lineWidth
            );
        });
    }, [drawLine]);

    // Add a new stroke locally and broadcast it
    const addStroke = (stroke) => {
        strokesRef.current = [
            ...strokesRef.current,
            stroke
        ];

        drawLine(
            stroke.from,
            stroke.to,
            stroke.color,
            stroke.lineWidth
        );

        socket.emit("draw-line", stroke);
    };

    // Undo the most recent stroke segment
    const undo = () => {
        if (strokesRef.current.length === 0) return;

        strokesRef.current = strokesRef.current.slice(0, -1);

        redrawCanvas(strokesRef.current);

        socket.emit("undo-drawing");
    };

    // Clear the entire canvas
    const clearCanvas = () => {
        strokesRef.current = [];

        redrawCanvas([]);

        socket.emit("clear-canvas");
    };

    // Listen for drawing events from other players
    useEffect(() => {
        const handleRemoteDrawing = (stroke) => {
            strokesRef.current = [
                ...strokesRef.current,
                stroke
            ];

            drawLine(
                stroke.from,
                stroke.to,
                stroke.color,
                stroke.lineWidth
            );
        };

        const handleRemoteUndo = () => {
            strokesRef.current = strokesRef.current.slice(0, -1);
            redrawCanvas(strokesRef.current);
        };

        const handleRemoteClear = () => {
            strokesRef.current = [];
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
    }, [drawLine, redrawCanvas]);

    return {
        canvasRef,
        lastPointRef,
        addStroke,
        undo,
        clearCanvas,
        getCanvasPoint: (event) => {
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();

            return {
                x: (event.clientX - rect.left) *
                    (canvas.width / rect.width),
                y: (event.clientY - rect.top) *
                    (canvas.height / rect.height)
            };
        }
    };
}

export default useDrawing;
