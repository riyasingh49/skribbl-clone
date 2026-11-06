function ColorPicker({ colors, selectedColor, onColorChange }) {
    return (
        <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
                <button
                    key={color}
                    type="button"
                    onClick={() => onColorChange(color)}
                    title={color}
                    aria-label={`Select color ${color}`}
                    aria-pressed={selectedColor === color}
                    className={`h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${
                        selectedColor === color
                            ? "ring-[3px] ring-violet-500 ring-offset-2"
                            : "border border-slate-300"
                    }`}
                    style={{ backgroundColor: color }}
                />
            ))}
        </div>
    );
}

export default ColorPicker;
