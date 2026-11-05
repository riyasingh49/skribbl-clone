import { socket } from "./socket/socket";
import DrawingCanvas from "./components/drawing/DrawingCanvas";
import ChatPanel from "./components/chat/ChatPanel";
import useSocket from "./hooks/socket/useSocket";
import useGame from "./hooks/game/useGame";
import RoomLobby from "./components/room/RoomLobby";
import GameScreen from "./components/game/GameScreen";

function App() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const { connectionStatus } = useSocket();
  const {
    gameData,
    setGameData,
    wordChoices,
    isChoosingWord,
    startGame,
    selectWord,
  } = useGame();

  useEffect(() => {
    if (connectionStatus === "Disconnected") {
      setRoomData(null);
      setGameData(null);
    }
  }, [connectionStatus]);

  const handleCreateRoom = () => {
    setError("");
    setGameData(null);
    createRoom(username, setError);
  };

  const handleJoinRoom = () => {
    setError("");
    setGameData(null);
    joinRoom(username, setError);
  };

  const handleLeaveRoom = () => {
    setError("");

    leaveRoom(setError, () => {
      setGameData(null);
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

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Skribbl Clone</h1>

      <h3>Socket Status: {connectionStatus}</h3>

      {!roomData ? (
        <>
          <input
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            placeholder="Enter room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
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
        </>
      ) : (
        <>
          {roomData.players.map((player) => (
            <p key={player.id}>
              {player.username} — Score: {player.score}
              {player.id === roomData.hostId && " (Host)"}
            </p>
          ))}

          {!gameData ? (
            <>

              <RoomLobby
                roomData={roomData}
                isHost={socket.id === roomData.hostId}
                onStartGame={handleStartGame}
                onLeaveRoom={handleLeaveRoom}
              />

            </>
          ) : (
            <div>
              <GameScreen
                gameData={gameData}
                wordChoices={wordChoices}
                isChoosingWord={isChoosingWord}
                onSelectWord={handleSelectWord}
              />
            </div>
          )}
          {/* Room Chat */}
          <ChatPanel />
        </>
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
