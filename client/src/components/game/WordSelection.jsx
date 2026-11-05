function WordSelection({
    isDrawer,
    isChoosingWord,
    wordChoices,
    drawerName,
    onSelectWord
}) {
    if (!isChoosingWord) return null;

    if (!isDrawer) {
        return (
            <h3>{drawerName} is choosing a word...</h3>
        );
    }
    return (
        <div>
            <h3>Choose a word to draw:</h3>

            {wordChoices.map((word) => (
                <button
                    key={word}
                    onClick={() => onSelectWord?.(word)}
                >
                    {word}
                </button>
            ))}
        </div>
    );
}

export default WordSelection;
