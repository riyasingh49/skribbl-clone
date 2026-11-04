import { useRef, useEffect } from "react";
import { socket } from "../socket/socket";

function DrawingCanvas({ canDraw }) {
    const canvasRef = useRef(null);
    const lastPointRef = useRef(null);

    const getCanvasPoint = (event) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) * (canvas.width / rect.width),
            y: (event.clientY - rect.top) * (canvas.height / rect.height)
        };
    };

    // Draw a line on the canvas
    const drawLine = (from, to, color, lineWidth) => {
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
    };

    // Receive drawing lines from other players
    useEffect(() => {
        const handleRemoteDrawing = (data) => {
            const { from, to, color, lineWidth } = data;

            drawLine(from, to, color, lineWidth);
        };

        socket.on("draw-line", handleRemoteDrawing);

        return () => {
            socket.off("draw-line", handleRemoteDrawing);
        };
    }, []);

    const handlePointerDown = (event) => {
        if (!canDraw) return;

        const canvas = canvasRef.current;

        canvas.setPointerCapture(event.pointerId);
        lastPointRef.current = getCanvasPoint(event);
    };

    const handlePointerMove = (event) => {
        if (!canDraw || !lastPointRef.current) return;

        const currentPoint = getCanvasPoint(event);
        const previousPoint = lastPointRef.current;

        const color = "#222222";
        const lineWidth = 4;

        // Draw immediately on the drawer's canvas
        drawLine(previousPoint, currentPoint, color, lineWidth);

        // Send the line to the server
        socket.emit("draw-line", {
            from: previousPoint,
            to: currentPoint,
            color,
            lineWidth
        });

        lastPointRef.current = currentPoint;
    };

    const handlePointerUp = () => {
        lastPointRef.current = null;
    };

    return (
        <div style={{ width: "100%", maxWidth: "800px" }}>
            <canvas
                ref={canvasRef}
                width={800}
                height={450}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    width: "100%",
                    height: "auto",
                    border: "2px solid #333",
                    borderRadius: "8px",
                    backgroundColor: "#ffffff",
                    cursor: canDraw ? "crosshair" : "not-allowed",
                    touchAction: "none"
                }}
            />
        </div>
    );
}

export default DrawingCanvas;
