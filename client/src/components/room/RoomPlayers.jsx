function RoomPlayers({ roomData }) {
    return (
        <div>
            <h2>Room: {roomData.roomId || roomData.id}</h2>

            <h3>
                Players ({roomData.players.length})
            </h3>

            {roomData.players.map((player) => (
                <p key={player.id}>
                    {player.username} — Score: {player.score}
                    {player.id === roomData.hostId && " (Host)"}
                </p>
            ))}
        </div>
    );
}

export default RoomPlayers;
