
import RoomPlayers from "./RoomPlayers";
import RoomLobby from "./RoomLobby";
import GameScreen from "../game/GameScreen";
import ChatPanel from "../chat/ChatPanel";

function RoomSession({
    roomData,
    gameData,
    isHost,
    onStartGame,
    onLeaveRoom,
    wordChoices,
    isChoosingWord,
    onSelectWord,
    myWord,
    remainingTime,
    onRequestHint,
    gameFinished,
    finishData,
    onNextTurn,
    onEndRound
}) {
    return (
        <section className="mx-auto grid w-full max-w-[1600px] grid-cols-[minmax(0,1fr)_minmax(260px,320px)] items-start gap-4 lg:gap-6">
            <div className="min-w-0 space-y-4">
                <RoomPlayers roomData={roomData} />

                {!gameData ? (
                    <RoomLobby
                        roomData={roomData}
                        isHost={isHost}
                        onStartGame={onStartGame}
                        onLeaveRoom={onLeaveRoom}
                    />
                ) : (
                    <GameScreen
                        gameData={gameData}
                        wordChoices={wordChoices}
                        isChoosingWord={isChoosingWord}
                        onSelectWord={onSelectWord}
                        myWord={myWord}
                        remainingTime={remainingTime}
                        onRequestHint={onRequestHint}
                        gameFinished={gameFinished}
                        finishData={finishData}
                        isHost={isHost}
                        onNextTurn={onNextTurn}
                        onEndRound={onEndRound}
                    />
                )}
            </div>

            <aside className="sticky top-5 min-w-0">
                <ChatPanel />
            </aside>
        </section>
    );
}

export default RoomSession;
