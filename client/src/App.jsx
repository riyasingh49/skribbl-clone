import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import DrawingCanvas from "./components/DrawingCanvas";

function App() {
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [roomData, setRoomData] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [gameData, setGameData] = useState(null);
  const [wordChoices, setWordChoices] = useState([]);
  const [isChoosingWord, setIsChoosingWord] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      setConnectionStatus("Connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("Disconnected");
      setRoomData(null);
      setGameData(null);
    });

    socket.on("room-updated", (room) => {
      setRoomData(room);
    });

    socket.on("player-left", (player) => {
      console.log(`${player.username} left the room`);
    });

    socket.on("game-started", (game) => {
      console.log("Game started:", game);
      setGameData(game);
      setError("");
    });

    socket.on("word-choices", (choices) => {
      setWordChoices(choices);
      setIsChoosingWord(true);
    });

    socket.on("drawing-started", (data) => {
      setGameData((previous) => ({
        ...previous,
        ...data,
        drawer: data.drawer
      }));

      setIsChoosingWord(false);
      setWordChoices([]);
    });

    socket.on("your-word", (data) => {
      console.log("Your selected word:", data.word);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("room-updated");
      socket.off("player-left");
      socket.off("game-started");
      socket.off("word-choices");
      socket.off("drawing-started");
      socket.off("your-word");
      socket.disconnect();
    };
  }, []);

  const handleCreateRoom = () => {
    setError("");

    socket.emit(
      "create-room",
      {
        username,
        settings: {
          maxPlayers: 6,
          totalRounds: 3,
          drawTime: 80
        }
      },
      (response) => {
        if (response.success) {
          setRoomData(response.room);
          setRoomId(response.room.id);
          setGameData(null);
        } else {
          setError(response.error);
        }
      }
    );
  };

  const handleJoinRoom = () => {
    setError("");

    socket.emit(
      "join-room",
      {
        username,
        roomId
      },
      (response) => {
        if (response.success) {
          setRoomData(response.room);
          setGameData(null);
        } else {
          setError(response.error);
        }
      }
    );
  };

  const handleLeaveRoom = () => {
    setError("");

    socket.emit("leave-room", (response) => {
      if (response.success) {
        setRoomData(null);
        setRoomId("");
        setGameData(null);
      } else {
        setError(response.error);
      }
    });
  };

  const handleStartGame = () => {
    setError("");

    socket.emit("start-game", (response) => {
      if (!response.success) {
        setError(response.error);
      } else {
        console.log(response.message);
      }
    });
  };

  const handleSelectWord = (word) => {
    setError("");

    socket.emit("select-word", { word }, (response) => {
      if (!response.success) {
        setError(response.error);
      } else {
        setWordChoices([]);
        setIsChoosingWord(false);
      }
    });
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
          <h2>Room Lobby</h2>

          <h3>Room ID: {roomData.id}</h3>

          <h3>
            Players ({roomData.players.length})
          </h3>

          {roomData.players.map((player) => (
            <p key={player.id}>
              {player.username} — Score: {player.score}
              {player.id === roomData.hostId && " (Host)"}
            </p>
          ))}

          {!gameData ? (
            <>
              {socket.id === roomData.hostId && (
                <button
                  onClick={handleStartGame}
                  disabled={roomData.players.length < 2}
                >
                  Start Game
                </button>
              )}

              <br /><br />

              <button onClick={handleLeaveRoom}>
                Leave Room
              </button>
            </>
          ) : (
            <div>
              <h2>Game Started!</h2>

              <p>
                Round: {gameData.currentRound} /{" "}
                {gameData.totalRounds}
              </p>

              <p>
                Current Drawer: {gameData.drawer.username}
              </p>

              {isChoosingWord && socket.id === gameData.drawer.id ? (
                <div>
                  <h3>Choose a word to draw:</h3>

                  {wordChoices.map((word) => (
                    <button
                      key={word}
                      onClick={() => handleSelectWord(word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
              ) : (
                <p>
                  {isChoosingWord
                    ? `${gameData.drawer.username} is choosing a word...`
                    : "Waiting for the drawing round..."}
                </p>
              )}
              {gameData.status === "drawing" && (
                <div>
                  <h3>Drawing Area</h3>

                  <DrawingCanvas
                    canDraw={socket.id === gameData.drawer.id}
                  />
                </div>
              )}
            </div>
          )}
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
