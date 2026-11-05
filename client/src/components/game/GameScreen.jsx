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
    finishData = null
}) {
    if (!gameData) return <p>Waiting for game data...</p>;

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
                <RoundResult correctWord={gameData.correctWord} />
            )}
        </div>
    );
}

export default GameScreen;
