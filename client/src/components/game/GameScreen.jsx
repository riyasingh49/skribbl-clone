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
    onNextTurn,
    onEndRound
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
        <section className="game-screen">
            <GameHeader gameData={gameData} />

            {status === "selecting-word" && (
                <WordSelection
                    isDrawer={isDrawer}
                    isChoosingWord={isChoosingWord}
                    wordChoices={wordChoices}
                    drawerName={gameData.drawer?.username}
                    onSelectWord={onSelectWord}
                />
            )}

            {status === "drawing" && (
                <>
                    <DrawingRound
                        isDrawer={isDrawer}
                        myWord={myWord}
                        remainingTime={remainingTime}
                        hint={gameData.hint}
                        onRequestHint={onRequestHint}
                    />

                    {isHost && (
                        <button onClick={onEndRound}>
                            End Round
                        </button>
                    )}
                </>
            )}

            {status === "round-ended" && (
                <div className="round-ended">
                    <RoundResult
                        correctWord={gameData.correctWord}
                    />

                    {isHost ? (
                        <button onClick={onNextTurn}>
                            Next Turn
                        </button>
                    ) : (
                        <p>
                            Waiting for the host to start the next turn...
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}

export default GameScreen;
