function GameHeader({ gameData }) {
    return (
        <div>
            <h2>Skribbl Game</h2>
            <p>
                Round: {gameData.currentRound} / {gameData.totalRounds}
            </p>
            <p>
                Current Drawer: {gameData.drawer?.username || "Unknown"}
            </p>
        </div>
    );
}

export default GameHeader;
