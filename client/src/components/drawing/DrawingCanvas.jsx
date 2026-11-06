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
            color: selectedColor,
            lineWidth: brushSize,
            isErasing
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
        <div className="mx-auto w-full max-w-[800px]">
            {canDraw && (
                <div className="mb-4 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4">
                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                            Drawing colors
                        </p>
                        <ColorPicker
                            colors={colors}
                            selectedColor={selectedColor}
                            onColorChange={setSelectedColor}
                        />
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                            Brush settings
                        </p>
                        <BrushSizePicker
                            brushSizes={brushSizes}
                            brushSize={brushSize}
                            onBrushSizeChange={setBrushSize}
                        />
                    </div>

                    <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                            Canvas actions
                        </p>
                        <DrawingActions
                            isErasing={isErasing}
                            onEraserToggle={() =>
                                setIsErasing((value) => !value)
                            }
                            onUndo={undo}
                            onClear={clearCanvas}
                        />
                    </div>
                </div>
            )}

            <p className="mb-2 text-xs font-semibold text-slate-500">
                {canDraw
                    ? "✏️ Your drawing canvas"
                    : "👀 Watch the drawer!"}
            </p>

            <canvas
                ref={canvasRef}
                width={800}
                height={450}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={`block h-auto w-full rounded-xl border-2 border-slate-300 bg-white ${
                    canDraw ? "cursor-crosshair" : "cursor-not-allowed"
                }`}
                style={{ touchAction: "none" }}
            />
        </div>
    );
}

export default DrawingCanvas;
