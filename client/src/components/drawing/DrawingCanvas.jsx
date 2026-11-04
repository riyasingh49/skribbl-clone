import { useState } from "react";
import useDrawing from "../../hooks/useDrawing";

import ColorPicker from "./ColorPicker";
import BrushSizePicker from "./BrushSizePicker";
import DrawingActions from "./DrawingActions";

function DrawingCanvas({ canDraw }) {
    const {
        canvasRef,
        lastPointRef,
        addStroke,
        undo,
        clearCanvas,
        getCanvasPoint,
    } = useDrawing();

    const [selectedColor, setSelectedColor] = useState("#222222");
    const [brushSize, setBrushSize] = useState(4);
    const [isErasing, setIsErasing] = useState(false);

    const colors = [
        "#222222",
        "#FF0000",
        "#0000FF",
        "#008000",
        "#FFFF00",
        "#FFA500",
        "#800080",
        "#FF69B4",
        "#FFFFFF",
        "#A52A2A",
    ];

    const brushSizes = [2, 4, 8, 12, 20];

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

        const stroke = {
            from: previousPoint,
            to: currentPoint,
            color: isErasing ? "#FFFFFF" : selectedColor,
            lineWidth: brushSize,
        };

        addStroke(stroke);

        lastPointRef.current = currentPoint;
    };

    const handlePointerUp = () => {
        lastPointRef.current = null;
    };

    return (
        <div style={{ width: "100%", maxWidth: "800px" }}>
            {canDraw && (
                <ColorPicker
                    colors={colors}
                    selectedColor={selectedColor}
                    onColorChange={setSelectedColor}
                />
            )}

            {canDraw && (
                <BrushSizePicker
                    brushSizes={brushSizes}
                    brushSize={brushSize}
                    onBrushSizeChange={setBrushSize}
                />
            )}

            {canDraw && (
                <DrawingActions
                    isErasing={isErasing}
                    onEraserToggle={() => setIsErasing(!isErasing)}
                    onUndo={undo}
                    onClear={clearCanvas}
                />
            )}

            <p>
                {canDraw
                    ? `Selected color: ${selectedColor}`
                    : "Watch the drawer!"}
            </p>

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
                    touchAction: "none",
                }}
            />
        </div>
    );
}

export default DrawingCanvas;
