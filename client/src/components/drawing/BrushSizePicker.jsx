
function BrushSizePicker({ brushSizes, brushSize, onBrushSizeChange }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {brushSizes.map((size) => (
                <button
                    key={size}
                    type="button"
                    onClick={() => onBrushSizeChange(size)}
                    aria-label={`Set brush size to ${size} pixels`}
                    aria-pressed={brushSize === size}
                    className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                        brushSize === size
                            ? "border-violet-500 bg-violet-600 text-white shadow-sm"
                            : "border-slate-300 bg-white text-slate-700 hover:border-violet-400 hover:bg-violet-50"
                    }`}
                >
                    {size}px
                </button>
            ))}
        </div>
    );
}

export default BrushSizePicker;
