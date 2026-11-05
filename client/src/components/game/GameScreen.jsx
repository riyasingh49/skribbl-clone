import { socket } from "../../socket/socket";
import GameHeader from "./GameHeader";
import WordSelection from "./WordSelection";
import DrawingRound from "./DrawingRound";
import RoundResult from "./RoundResult";
import GameResults from "./GameResults";

function GameScreen({
    gameData,
    wordChoices = [],
    isChoosingWord = false,
    onSelectWord,
    myWord = null,
    remainingTime = 0,
    onRequestHint,
    gameFinished = false,
    finishData = null,
    isHost = false,
    onNextTurn
}) {
    if (!gameData) {
        return <p>Waiting for game data...</p>;
    }

    const isDrawer = socket.id === gameData.drawer?.id;
    const status = gameData.roundStatus;

    if (gameFinished || status === "finished") {
        return (
            <GameResults
                winner={finishData?.winner}
                leaderboard={
                    finishData?.leaderboard || gameData.leaderboard
                }
            />
        );
    }

    return (
        <div>
            <GameHeader gameData={gameData} />

            <WordSelection
                isDrawer={isDrawer}
                isChoosingWord={
                    isChoosingWord && status === "selecting-word"
                }
                wordChoices={wordChoices}
                drawerName={gameData.drawer?.username}
                onSelectWord={onSelectWord}
            />

            {status === "drawing" && (
                <DrawingRound
                    isDrawer={isDrawer}
                    myWord={myWord}
                    remainingTime={remainingTime}
                    hint={gameData.hint}
                    onRequestHint={onRequestHint}
                />
            )}

            {status === "round-ended" && (
                <div>
                    <RoundResult
                        correctWord={gameData.correctWord}
                    />

                    {isHost && (
                        <button onClick={onNextTurn}>
                            Next Turn
                        </button>
                    )}

                    {!isHost && (
                        <p>Waiting for the host to start the next turn...</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default GameScreen;
