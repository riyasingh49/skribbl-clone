
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
        return (
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
                Waiting for game data...
            </div>
        );
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
        <section className="min-w-0 space-y-5">
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
                <div className="space-y-4">
                    <DrawingRound
                        isDrawer={isDrawer}
                        myWord={myWord}
                        remainingTime={remainingTime}
                        hint={gameData.hint}
                        onRequestHint={onRequestHint}
                    />

                    {isHost && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={onEndRound}
                                className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                            >
                                End Round
                            </button>
                        </div>
                    )}
                </div>
            )}

            {status === "round-ended" && (
                <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
                    <RoundResult
                        correctWord={gameData.correctWord}
                    />

                    {isHost ? (
                        <button
                            type="button"
                            onClick={onNextTurn}
                            className="w-full rounded-xl bg-violet-600 px-5 py-3 font-semibold text-white transition hover:bg-violet-500 sm:w-auto"
                        >
                            Next Turn →
                        </button>
                    ) : (
                        <p className="text-sm text-slate-400">
                            Waiting for the host to start the next turn...
                        </p>
                    )}
                </div>
            )}
        </section>
    );
}

export default GameScreen;
