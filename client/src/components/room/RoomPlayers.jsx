
function RoomPlayers({ roomData }) {
    const players = roomData?.players || [];

    return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-white">
                        Players
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                        Room: {roomData.roomId || roomData.id}
                    </p>
                </div>

                <span className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-sm font-bold text-violet-300">
                    {players.length} players
                </span>
            </div>

            <div className="space-y-2">
                {players.map((player, index) => {
                    const isHost = player.id === roomData.hostId;

                    return (
                        <div
                            key={player.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 font-bold text-white">
                                    {(player.username || "?")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-200">
                                        {player.username}
                                    </p>

                                    {isHost && (
                                        <span className="text-xs font-semibold text-amber-400">
                                            👑 Host
                                        </span>
                                    )}
                                </div>
                            </div>

                            <span className="shrink-0 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-emerald-300">
                                {player.score ?? 0} pts
                            </span>
                        </div>
                    );
                })}

                {players.length === 0 && (
                    <p className="py-6 text-center text-sm text-slate-500">
                        No players have joined yet.
                    </p>
                )}
            </div>
        </section>
    );
}

export default RoomPlayers;
