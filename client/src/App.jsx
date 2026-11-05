import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import useSocket from "./hooks/socket/useSocket";
import useRoom from "./hooks/room/useRoom";
import useGame from "./hooks/game/useGame";
import RoomLobby from "./components/room/RoomLobby";
import GameScreen from "./components/game/GameScreen";
import ChatPanel from "./components/chat/ChatPanel";

function App() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const { connectionStatus } = useSocket();

    const {
        roomData,
        setRoomData,
        roomId,
        setRoomId,
        createRoom,
        joinRoom,
        leaveRoom
    } = useRoom();

    const {
        gameData,
        setGameData,
        wordChoices,
        isChoosingWord,
        startGame,
        myWord,
        remainingTime,
        requestHint,
        gameFinished,
        selectWord,
        finishData,
        resetGame,
        nextTurn
    } = useGame();

    useEffect(() => {
        if (connectionStatus === "Disconnected") {
            setRoomData(null);
            setGameData(null);
            resetGame();
        }
    }, [
        connectionStatus,
        setRoomData,
        setGameData,
        resetGame
    ]);

    const handleCreateRoom = () => {
        setError("");
        resetGame();
        setGameData(null);
        createRoom(username.trim(), setError);
    };

    const handleJoinRoom = () => {
        setError("");
        resetGame();
        setGameData(null);
        joinRoom(username.trim(), setError);
    };

    const handleLeaveRoom = () => {
        setError("");

        leaveRoom(setError, () => {
            setGameData(null);
            resetGame();
        });
    };

    const handleStartGame = () => {
        setError("");
        startGame(setError);
    };

    const handleSelectWord = (word) => {
        setError("");
        selectWord(word, setError);
    };

    const handleNextTurn = () => {
        setError("");
        nextTurn(setError);
    };

    return (
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1>Skribbl Clone</h1>

            <h3>Socket Status: {connectionStatus}</h3>

            {!roomData ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                    />

                    <br /><br />

                    <button
                        onClick={handleCreateRoom}
                        disabled={
                            connectionStatus !== "Connected" ||
                            !username.trim()
                        }
                    >
                        Create Room
                    </button>

                    <br /><br />

                    <input
                        type="text"
                        placeholder="Enter room ID"
                        value={roomId}
                        onChange={(event) =>
                            setRoomId(event.target.value.toUpperCase())
                        }
                    />

                    <br /><br />

                    <button
                        onClick={handleJoinRoom}
                        disabled={
                            connectionStatus !== "Connected" ||
                            !username.trim() ||
                            !roomId.trim()
                        }
                    >
                        Join Room
                    </button>
                </div>
            ) : (
                <div>
                    <h2>Room: {roomData.roomId || roomData.id}</h2>

                    <h3>Players</h3>

                    {roomData.players.map((player) => (
                        <p key={player.id}>
                            {player.username} — Score: {player.score}
                            {player.id === roomData.hostId && " (Host)"}
                        </p>
                    ))}

                    {!gameData ? (
                        <RoomLobby
                            roomData={roomData}
                            isHost={socket.id === roomData.hostId}
                            onStartGame={handleStartGame}
                            onLeaveRoom={handleLeaveRoom}
                        />
                    ) : (
                        <GameScreen
                            gameData={gameData}
                            wordChoices={wordChoices}
                            isChoosingWord={isChoosingWord}
                            onSelectWord={handleSelectWord}
                            myWord={myWord}
                            remainingTime={remainingTime}
                            onRequestHint={requestHint}
                            gameFinished={gameFinished}
                            finishData={finishData}
                            isHost={socket.id === roomData.hostId}
                            onNextTurn={handleNextTurn}
                        />
                    )}

                    <ChatPanel />
                </div>
            )}

            {error && (
                <p style={{ color: "red" }}>
                    {error}
                </p>
            )}
        </div>
    );
}

export default App;
