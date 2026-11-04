function ColorPicker({ colors, selectedColor, onColorChange }) {
    return (
        <div
            style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "15px"
            }}
        >
            {colors.map((color) => (
                <button
                    key={color}
                    onClick={() => onColorChange(color)}
                    title={color}
                    style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        border: selectedColor === color
                            ? "3px solid #555"
                            : "1px solid #999",
                        cursor: "pointer"
                    }}
                />
            ))}
        </div>
    );
}

export default ColorPicker;
