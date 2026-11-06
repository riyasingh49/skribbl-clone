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
    const roomCode = roomData?.roomId || roomData?.id || "------";

    return (
        <main className="min-h-screen bg-[#0d1019] px-4 py-8 text-white sm:px-6">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="mb-2 text-xs font-bold tracking-[0.25em] text-violet-400">
                            GAME ROOM
                        </p>
                        <h1 className="font-display text-3xl font-bold sm:text-4xl">
                            Waiting lobby<span className="text-violet-400">.</span>
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Gather your friends and get ready to draw.
                        </p>
                    </div>

                    <span className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        ROOM ACTIVE
                    </span>
                </header>

                <section className="mb-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 to-slate-900 p-6">
                        <p className="text-xs font-bold tracking-widest text-violet-300">
                            ROOM CODE
                        </p>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <h2 className="font-display text-3xl font-bold tracking-[0.15em] sm:text-4xl">
                                {roomCode}
                            </h2>
                            <span className="rounded-lg bg-violet-500/20 px-3 py-2 text-sm">
                                {roomData?.isPrivate ? "🔒 Private" : "🌐 Public"}
                            </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-400">
                            Share this code with friends so they can join.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <p className="text-xs text-slate-500">Players</p>
                            <p className="mt-2 text-3xl font-bold">
                                {playerCount}
                                <span className="text-lg text-slate-500">/{maxPlayers}</span>
                            </p>
                            <p className="mt-1 text-xs text-slate-500">In this room</p>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                            <p className="text-xs text-slate-500">Rounds</p>
                            <p className="mt-2 text-3xl font-bold">{totalRounds}</p>
                            <p className="mt-1 text-xs text-slate-500">Total rounds</p>
                        </div>

                        <div className="col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Drawing time</span>
                                <strong className="text-sm text-white">{drawTime} seconds</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-7">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-bold">Players in room</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                {playerCount} of {maxPlayers} spots filled
                            </p>
                        </div>

                        <span className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300">
                            {playerCount}/{maxPlayers} JOINED
                        </span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {players.map((player, index) => {
                            const isPlayerHost = player.id === roomData?.hostId;
                            const initial = (player.username || "?")
                                .charAt(0)
                                .toUpperCase();

                            return (
                                <div
                                    key={player.id}
                                    className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                                >
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-lg font-bold">
                                        {initial}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-white">
                                            {player.username || "Player"}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {isPlayerHost ? "Room host 👑" : `Player ${index + 1}`}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        {isPlayerHost && (
                                            <span className="block text-xs font-semibold text-amber-400">
                                                HOST
                                            </span>
                                        )}
                                        <span className="text-sm font-bold text-violet-300">
                                            {player.score ?? 0} pts
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {Array.from(
                            { length: Math.max(0, maxPlayers - playerCount) },
                            (_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="flex items-center gap-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/30 p-4"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/70 text-xl text-slate-500">
                                        +
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-500">
                                            Waiting for player
                                        </p>
                                        <p className="mt-1 text-xs text-slate-600">
                                            Empty slot
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-7 border-t border-slate-800 pt-6">
                        {isHost ? (
                            <div>
                                <button
                                    type="button"
                                    onClick={onStartGame}
                                    disabled={!canStartGame}
                                    className="w-full rounded-xl bg-violet-600 px-5 py-4 font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    {canStartGame ? "Start game  →" : "Waiting for players..."}
                                </button>

                                {!canStartGame && (
                                    <p className="mt-3 text-center text-xs text-slate-500">
                                        At least 2 players are required to start.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-4 text-center text-sm text-slate-400">
                                <span className="mr-2 text-emerald-400">●</span>
                                Waiting for the host to start the game...
                            </p>
                        )}

                        <button
                            type="button"
                            onClick={onLeaveRoom}
                            className="mt-4 w-full rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                        >
                            Leave room
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default RoomLobby;
