function RoomLobby({
    roomData,
    isHost,
    onStartGame,
    onLeaveRoom
}) {
    const players = roomData?.players || [];
    const settings = roomData?.settings || {};

    const maxPlayers = settings.maxPlayers ?? 6;
    const totalRounds = settings.totalRounds ?? 3;
    const drawTime = settings.drawTime ?? 80;

    const playerCount = players.length;
    const canStartGame = isHost && playerCount >= 2;

    return (
        <section className="room-lobby">
            <h2>Room Lobby</h2>

            <div className="room-details">
                <h3>
                    Room ID: {roomData.roomId || roomData.id}
                </h3>

                <p>
                    Room Type: {roomData.isPrivate ? "Private 🔒" : "Public 🌐"}
                </p>

                <p>
                    Players: {playerCount}/{maxPlayers}
                </p>

                <p>
                    Total Rounds: {totalRounds}
                </p>

                <p>
                    Drawing Time: {drawTime} seconds
                </p>
            </div>

            <hr />

            <h3>Players in Room</h3>

            {players.length > 0 ? (
                <ul>
                    {players.map((player) => (
                        <li key={player.id}>
                            <strong>{player.username}</strong>

                            {player.id === roomData.hostId && (
                                <span> — Host 👑</span>
                            )}

                            <span> — Score: {player.score ?? 0}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No players have joined yet.</p>
            )}

            <hr />

            {isHost ? (
                <div>
                    <button
                        onClick={onStartGame}
                        disabled={!canStartGame}
                    >
                        Start Game
                    </button>

                    {!canStartGame && (
                        <p>You need at least 2 players to start the game.</p>
                    )}
                </div>
            ) : (
                <p>Waiting for the host to start the game...</p>
            )}

            <button onClick={onLeaveRoom}>
                Leave Room
            </button>
        </section>
    );
}

export default RoomLobby;
