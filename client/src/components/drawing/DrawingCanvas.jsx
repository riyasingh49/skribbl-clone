import { useState } from "react";
import useDrawing from "../../hooks/drawing/useDrawing";
import ColorPicker from "./ColorPicker";
import BrushSizePicker from "./BrushSizePicker";
import DrawingActions from "./DrawingActions";

function DrawingCanvas({ canDraw }) {
    const {
        canvasRef,
        lastPointRef,
        startStroke,
        finishStroke,
        addStroke,
        undo,
        clearCanvas,
        getCanvasPoint
    } = useDrawing({ canDraw });

    const [selectedColor, setSelectedColor] = useState("#222222");
    const [brushSize, setBrushSize] = useState(4);
    const [isErasing, setIsErasing] = useState(false);

    const colors = [
        "#222222", "#FF0000", "#0000FF",
        "#008000", "#FFFF00", "#FFA500",
        "#800080", "#FF69B4", "#FFFFFF", "#A52A2A"
    ];

    const brushSizes = [2, 4, 8, 12, 20];

    const handlePointerDown = (event) => {
        if (!canDraw) return;

        event.currentTarget.setPointerCapture(event.pointerId);

        startStroke();
        lastPointRef.current = getCanvasPoint(event);
    };

    const handlePointerMove = (event) => {
        if (!canDraw || !lastPointRef.current) return;

        const currentPoint = getCanvasPoint(event);

        addStroke({
            from: lastPointRef.current,
            to: currentPoint,
            color: isErasing ? "#FFFFFF" : selectedColor,
            lineWidth: brushSize
        });

        lastPointRef.current = currentPoint;
    };

    const handlePointerUp = (event) => {
        if (!lastPointRef.current) return;

        finishStroke();
        lastPointRef.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    return (
        <div style={{ width: "100%", maxWidth: "800px" }}>
            {canDraw && (
                <>
                    <ColorPicker
                        colors={colors}
                        selectedColor={selectedColor}
                        onColorChange={setSelectedColor}
                    />

                    <BrushSizePicker
                        brushSizes={brushSizes}
                        brushSize={brushSize}
                        onBrushSizeChange={setBrushSize}
                    />

                    <DrawingActions
                        isErasing={isErasing}
                        onEraserToggle={() => setIsErasing(value => !value)}
                        onUndo={undo}
                        onClear={clearCanvas}
                    />
                </>
            )}

            <p>
                {canDraw ? "Your drawing canvas" : "Watch the drawer!"}
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
                    backgroundColor: "#fff",
                    cursor: canDraw ? "crosshair" : "not-allowed",
                    touchAction: "none"
                }}
            />
        </div>
    );
}

export default DrawingCanvas;
