
function DrawingActions({
    isErasing,
    onEraserToggle,
    onUndo,
    onClear
}) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={onEraserToggle}
                aria-pressed={isErasing}
                className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${
                    isErasing
                        ? "border-violet-500 bg-violet-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:bg-violet-50"
                }`}
            >
                {isErasing ? "✓ Eraser Active" : "⌫ Eraser"}
            </button>

            <button
                type="button"
                onClick={onUndo}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:bg-violet-50"
            >
                ↶ Undo
            </button>

            <button
                type="button"
                onClick={onClear}
                className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
                🗑 Clear Canvas
            </button>
        </div>
    );
}

export default DrawingActions;
