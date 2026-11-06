import DrawingCanvas from "../drawing/DrawingCanvas";

function DrawingRound({
    isDrawer,
    myWord,
    remainingTime,
    hint,
    onRequestHint
}) {
    return (
        <div>
            <h3>Time Remaining: {remainingTime}s</h3>

            {isDrawer ? (
                <h3>Your Word: {myWord || "Loading..."}</h3>
            ) : (
                <div>
                    <h3>Guess the word!</h3>

                    <p>
                        Hint: {hint || "No letters revealed yet"}
                    </p>

                    <button
                        onClick={onRequestHint}
                        disabled={!onRequestHint}
                    >
                        Request Hint
                    </button>
                </div>
            )}

            <h3>Drawing Area</h3>

            <DrawingCanvas canDraw={isDrawer} />
        </div>
    );
}

export default DrawingRound;
