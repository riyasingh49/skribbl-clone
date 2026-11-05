import { useCallback } from "react";

function useCanvas(canvasRef) {
    // Draw one line segment
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
    }, [canvasRef]);

    // Clear and redraw the canvas
    const redrawCanvas = useCallback((strokes) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        strokes.forEach((stroke) => {
            drawLine(
                stroke.from,
                stroke.to,
                stroke.color,
                stroke.lineWidth
            );
        });
    }, [canvasRef, drawLine]);

    // Clear the canvas completely
    const clearCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }, [canvasRef]);

    return {
        drawLine,
        redrawCanvas,
        clearCanvas
    };
}

export default useCanvas;
