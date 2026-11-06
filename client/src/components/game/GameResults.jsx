
function GameResults({ winner, leaderboard = [] }) {
    const medals = ["🥇", "🥈", "🥉"];

    const sortedLeaderboard = [...leaderboard].sort(
        (a, b) => (b.score || 0) - (a.score || 0)
    );

    return (
        <section className="mx-auto w-full max-w-3xl space-y-5">
            {/* Winner */}
            <div className="overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/15 via-slate-900 to-violet-500/10 p-6 text-center shadow-xl sm:p-8">
                <div className="text-6xl">🏆</div>

                <p className="mt-4 text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                    Game completed
                </p>

                <h2 className="mt-2 font-display text-3xl font-extrabold text-white sm:text-4xl">
                    We have a winner!
                </h2>

                <div className="mx-auto mt-6 max-w-sm rounded-2xl border border-amber-400/20 bg-slate-950/60 p-5">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-2xl font-extrabold text-slate-950">
                        {(winner?.username || "?")
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <p className="mt-3 text-xs font-bold uppercase tracking-wider text-amber-400">
                        Champion
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-white">
                        {winner?.username || "No winner"}
                    </h3>

                    {winner?.score !== undefined && (
                        <p className="mt-2 text-sm text-slate-400">
                            {winner.score} points
                        </p>
                    )}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            🏅 Final Leaderboard
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                            Final player rankings
                        </p>
                    </div>

                    <span className="rounded-lg bg-violet-500/15 px-3 py-1.5 text-xs font-bold text-violet-300">
                        {sortedLeaderboard.length} players
                    </span>
                </div>

                <div className="space-y-3">
                    {sortedLeaderboard.map((player, index) => (
                        <div
                            key={player.id || player.username}
                            className={`flex items-center justify-between gap-3 rounded-xl border p-3 sm:p-4 ${
                                index === 0
                                    ? "border-amber-400/30 bg-amber-500/5"
                                    : "border-slate-800 bg-slate-950/50"
                            }`}
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="w-8 shrink-0 text-center text-xl">
                                    {medals[index] || `#${index + 1}`}
                                </span>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 font-bold text-white">
                                    {(player.username || "?")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-white">
                                        {player.username || "Player"}
                                    </p>

                                    {index === 0 && (
                                        <p className="text-xs text-amber-400">
                                            Champion
                                        </p>
                                    )}
                                </div>
                            </div>

                            <span className="shrink-0 rounded-lg bg-slate-800 px-3 py-2 text-sm font-bold text-emerald-300">
                                {player.score ?? 0} pts
                            </span>
                        </div>
                    ))}

                    {sortedLeaderboard.length === 0 && (
                        <p className="py-6 text-center text-sm text-slate-500">
                            No leaderboard data available.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}

export default GameResults;
