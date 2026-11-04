function DrawingActions({
    isErasing,
    onEraserToggle,
    onUndo,
    onClear
}) {
    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "15px"
            }}
        >
            {/* Eraser */}
            <button
                onClick={onEraserToggle}
                style={{
                    padding: "8px 16px",
                    backgroundColor: isErasing ? "#ddd" : "#fff",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                {isErasing ? "Eraser Active" : "Eraser"}
            </button>

            {/* Undo */}
            <button
                onClick={onUndo}
                style={{
                    padding: "8px 16px",
                    border: "1px solid #333",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: "#fff"
                }}
            >
                ↶ Undo
            </button>

            {/* Clear Canvas */}
            <button
                onClick={onClear}
                style={{
                    padding: "8px 16px",
                    border: "1px solid #dc2626",
                    borderRadius: "6px",
                    backgroundColor: "#fff",
                    color: "#dc2626",
                    cursor: "pointer"
                }}
            >
                Clear Canvas
            </button>
        </div>
    );
}

export default DrawingActions;
