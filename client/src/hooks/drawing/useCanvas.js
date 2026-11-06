import { useCallback } from "react";

function useCanvas(canvasRef) {
    const drawLine = useCallback((
        from,
        to,
        color,
        lineWidth,
        isErasing = false
    ) => {
        const canvas = canvasRef.current;
        if (!canvas || !from || !to) return;

        const context = canvas.getContext("2d");

        context.save();
        context.globalCompositeOperation = isErasing
            ? "destination-out"
            : "source-over";

        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);

        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.lineCap = "round";
        context.lineJoin = "round";

        context.stroke();
        context.restore();
    }, [canvasRef]);

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
                stroke.lineWidth,
                stroke.isErasing || false
            );
        });
    }, [canvasRef, drawLine]);

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
