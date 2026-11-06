
import { useEffect, useState } from "react";
import { socket } from "./socket/socket";

import useSocket from "./hooks/socket/useSocket";
import useRoom from "./hooks/room/useRoom";
import useGame from "./hooks/game/useGame";

import RoomEntry from "./components/room/RoomEntry";
import RoomLobby from "./components/room/RoomLobby";
import GameScreen from "./components/game/GameScreen";
import ChatPanel from "./components/chat/ChatPanel";

function App() {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    const [roomSettings, setRoomSettings] = useState({
        maxPlayers: 6,
        totalRounds: 3,
        drawTime: 80
    });

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
      nextTurn,
      endRound
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

    const handleCreateRoom = (options = {}) => {
        setError("");
        resetGame();
        setGameData(null);

        createRoom(username.trim(), setError, {
            ...roomSettings,
            isPrivate: options.isPrivate ?? false,
            password: options.password ?? ""
        });
    };

    const handleJoinRoom = (options = {}) => {
        setError("");
        resetGame();
        setGameData(null);

        joinRoom(username.trim(), setError, options);
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

    const handleEndRound = () => {
      setError("");
      endRound(setError);
  };

    return (
        <main className="app">
            <header className="app-header">
                <h1>🎨 Skribbl Clone</h1>
                <p>
                    Connection Status: {connectionStatus}
                </p>
            </header>

            {error && (
                <p className="error-message" role="alert">
                    {error}
                </p>
            )}

            {!roomData ? (
                <RoomEntry
                    username={username}
                    setUsername={setUsername}
                    roomId={roomId}
                    setRoomId={setRoomId}
                    onCreateRoom={handleCreateRoom}
                    onJoinRoom={handleJoinRoom}
                    roomSettings={roomSettings}
                    setRoomSettings={setRoomSettings}
                />
            ) : (
                <section className="game-room">
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
                      onEndRound={handleEndRound}
                  />
                    )}

                    <ChatPanel />
                </section>
            )}
        </main>
    );
}

export default App;
