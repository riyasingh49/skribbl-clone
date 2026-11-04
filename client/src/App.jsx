
import { useEffect, useState } from "react";
import { socket } from "./socket/socket";

function App() {
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");
    const [roomData, setRoomData] = useState(null);
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setConnectionStatus("Connected");
        });

        socket.on("disconnect", () => {
            setConnectionStatus("Disconnected");
            setRoomData(null);
        });

        socket.on("room-updated", (room) => {
            setRoomData(room);
        });

        socket.on("player-left", (player) => {
            console.log(`${player.username} left the room`);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("room-updated");
            socket.off("player-left");
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
                console.log("Successfully left room");
            } else {
                setError(response.error);
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
                        disabled={connectionStatus !== "Connected"}
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
                        disabled={connectionStatus !== "Connected"}
                    >
                        Join Room
                    </button>
                </>
            ) : (
                <>
                    <h2>Room Lobby</h2>

                    <h3>Room ID: {roomData.id}</h3>
                    <p>Host ID: {roomData.hostId}</p>

                    <h3>Players ({roomData.players.length})</h3>

                    {roomData.players.map((player) => (
                        <p key={player.id}>
                            {player.username} — Score: {player.score}
                            {player.id === roomData.hostId && " (Host)"}
                        </p>
                    ))}

                    <button onClick={handleLeaveRoom}>
                        Leave Room
                    </button>
                </>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default App;
