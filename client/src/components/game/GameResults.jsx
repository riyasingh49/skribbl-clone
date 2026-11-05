function GameResults({ winner, leaderboard = [] }) {
    return (
        <div>
            <h2>Game Finished!</h2>
            <h3>
                Winner: {winner?.username || "No winner"}
            </h3>
            <h3>Final Leaderboard</h3>
            {leaderboard.map((player, index) => (
                <p key={player.id}>
                    {index + 1}. {player.username} - {player.score} points
                </p>
            ))}
        </div>
    );
}

export default GameResults;
