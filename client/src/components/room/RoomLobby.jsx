function RoomLobby({
    roomData,
    isHost,
    onStartGame,
    onLeaveRoom,
}) {
    return (
        <div>
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

            {isHost && (
                <button
                    onClick={onStartGame}
                    disabled={roomData.players.length < 2}
                >
                    Start Game
                </button>
            )}

            <br /><br />

            <button onClick={onLeaveRoom}>
                Leave Room
            </button>
        </div>
    );
}

export default RoomLobby;
