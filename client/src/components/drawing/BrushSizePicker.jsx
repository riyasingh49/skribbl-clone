function BrushSizePicker({ brushSizes, brushSize, onBrushSizeChange }) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px"
            }}
        >
            <strong>Brush Size:</strong>

            {brushSizes.map((size) => (
                <button
                    key={size}
                    onClick={() => onBrushSizeChange(size)}
                    style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: brushSize === size
                            ? "2px solid #333"
                            : "1px solid #aaa",
                        backgroundColor: brushSize === size
                            ? "#ddd"
                            : "#fff",
                        cursor: "pointer"
                    }}
                >
                    {size}px
                </button>
            ))}
        </div>
    );
}

export default BrushSizePicker;
