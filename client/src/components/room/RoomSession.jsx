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
    onNextTurn
}) {
    return (
        <div>
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
                />
            )}

            <ChatPanel />
        </div>
    );
}

export default RoomSession;
