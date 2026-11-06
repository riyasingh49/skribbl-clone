
function GameHeader({ gameData }) {
    const currentRound = gameData.currentRound || 1;
    const totalRounds = gameData.totalRounds || 1;
    const progress = Math.min(
        (currentRound / totalRounds) * 100,
        100
    );

    return (
        <header className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-400">
                        Game in progress
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold text-white">
                        🎨 Skribbl Game
                    </h2>
                </div>

                <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                        Round
                    </p>
                    <p className="text-lg font-extrabold text-white">
                        {currentRound}
                        <span className="text-sm text-slate-400">
                            {" "}/ {totalRounds}
                        </span>
                    </p>
                </div>
            </div>

            <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-slate-400">
                    <span>Round progress</span>
                    <span>{Math.round(progress)}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-950/70 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-lg">
                    ✏️
                </span>
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Current drawer
                    </p>
                    <p className="text-sm font-semibold text-white">
                        {gameData.drawer?.username || "Unknown"}
                    </p>
                </div>
            </div>
        </header>
    );
}

export default GameHeader;
