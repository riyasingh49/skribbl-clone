import { socket } from "../../socket/socket";
import DrawingCanvas from "../drawing/DrawingCanvas";

function GameScreen({
    gameData,
    wordChoices,
    isChoosingWord,
    onSelectWord,
}) {
    const isDrawer = socket.id === gameData.drawer?.id;

    return (
        <div>
            <h2>Game Started!</h2>

            <p>
                Round: {gameData.currentRound} / {gameData.totalRounds}
            </p>

            <p>
                Current Drawer: {gameData.drawer?.username || "Unknown"}
            </p>

            {isChoosingWord && isDrawer ? (
                <div>
                    <h3>Choose a word to draw:</h3>

                    {wordChoices.map((word) => (
                        <button
                            key={word}
                            onClick={() => onSelectWord(word)}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            ) : (
                <p>
                    {isChoosingWord
                        ? `${gameData.drawer?.username} is choosing a word...`
                        : "Waiting for the drawing round..."}
                </p>
            )}

            {gameData.status === "drawing" && (
                <div>
                    <h3>Drawing Area</h3>

                    <DrawingCanvas canDraw={isDrawer} />
                </div>
            )}
        </div>
    );
}

export default GameScreen;
