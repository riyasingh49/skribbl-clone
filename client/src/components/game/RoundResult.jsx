function RoundResult({ correctWord }) {
    return (
        <div>
            <h3>Round Finished!</h3>

            {correctWord && (
                <p>Correct Word: {correctWord}</p>
            )}
        </div>
    );
}

export default RoundResult;
