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
        <main className="min-h-screen min-w-[320px] bg-[#0d1019] px-3 py-5 text-slate-100 sm:px-6 sm:py-8">

            {/* Entry screen */}
            {!roomData && (
                <div className="mx-auto w-full max-w-5xl">
                    {error && (
                        <p
                            className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

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
                </div>
            )}

            {/* Room and game screens */}
            {roomData && (
                <>
                    <header className="mx-auto mb-6 flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
                        <div>
                            <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                                🎨 Skribbl Clone
                            </h1>
                            <p className="mt-1 text-xs text-slate-400">
                                Draw, guess and have fun!
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs">
                            <span
                                className={`h-2 w-2 rounded-full ${
                                    connectionStatus === "Connected"
                                        ? "bg-emerald-400"
                                        : "bg-red-400"
                                }`}
                            />

                            <span className="text-slate-300">
                                {connectionStatus}
                            </span>
                        </div>
                    </header>

                    {error && (
                        <p
                            className="mx-auto mb-4 max-w-[1600px] rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <section className="mx-auto grid max-w-[1600px] grid-cols-[minmax(0,1fr)_minmax(260px,320px)] items-start gap-4 lg:gap-6">
                        <div className="min-w-0">
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
                        </div>

                        {/* Chat stays on the right */}
                        <aside className="sticky top-5 min-w-0">
                            <ChatPanel />
                        </aside>
                    </section>
                </>
            )}
        </main>
    );
}

export default App;
