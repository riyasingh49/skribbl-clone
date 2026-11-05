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
                    <p>Hint: {hint || "Waiting for hint..."}</p>

                    <button onClick={onRequestHint}>
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
