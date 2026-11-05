import { socket } from "../../socket/socket";
import DrawingCanvas from "../drawing/DrawingCanvas";

function GameScreen({
    gameData,
    wordChoices = [],
    isChoosingWord = false,
    onSelectWord,
    myWord = null,
    remainingTime = 0,
    onRequestHint,
    gameFinished = false,
    finishData = null
}) {
    if (!gameData) {
        return <p>Waiting for game data...</p>;
    }

    const isDrawer = socket.id === gameData.drawer?.id;
    const roundStatus = gameData.roundStatus;

    if (gameFinished || roundStatus === "finished") {
        const leaderboard =
            finishData?.leaderboard || gameData.leaderboard || [];

        return (
            <div>
                <h2>Game Finished!</h2>

                <h3>
                    Winner:{" "}
                    {finishData?.winner?.username || "No winner"}
                </h3>

                <h3>Final Leaderboard</h3>

                {leaderboard.map((player, index) => (
                    <p key={player.id}>
                        {index + 1}. {player.username} - {player.score} points
                    </p>
                ))}
            </div>
        );
    }

    return (
        <div>
            <h2>Skribbl Game</h2>

            <p>
                Round: {gameData.currentRound} / {gameData.totalRounds}
            </p>

            <p>
                Current Drawer:{" "}
                {gameData.drawer?.username || "Unknown"}
            </p>

            {roundStatus === "drawing" && (
                <div>
                    <h3>
                        Time Remaining: {remainingTime} seconds
                    </h3>

                    {isDrawer ? (
                        <h3>Your Word: {myWord || "Loading..."}</h3>
                    ) : (
                        <>
                            <h3>Guess the word!</h3>

                            <p>
                                Hint: {gameData.hint || "Waiting for hint..."}
                            </p>

                            <button onClick={onRequestHint}>
                                Request Hint
                            </button>
                        </>
                    )}
                </div>
            )}

            {isChoosingWord && roundStatus === "selecting-word" && (
                <div>
                    {isDrawer ? (
                        <>
                            <h3>Choose a word to draw:</h3>

                            {wordChoices.map((word) => (
                                <button
                                    key={word}
                                    onClick={() => onSelectWord?.(word)}
                                >
                                    {word}
                                </button>
                            ))}
                        </>
                    ) : (
                        <h3>
                            {gameData.drawer?.username} is choosing a word...
                        </h3>
                    )}
                </div>
            )}

            {roundStatus === "drawing" && (
                <div>
                    <h3>Drawing Area</h3>

                    <DrawingCanvas canDraw={isDrawer} />
                </div>
            )}

            {roundStatus === "round-ended" && (
                <div>
                    <h3>Round Finished!</h3>

                    {gameData.correctWord && (
                        <p>
                            Correct Word: {gameData.correctWord}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default GameScreen;
