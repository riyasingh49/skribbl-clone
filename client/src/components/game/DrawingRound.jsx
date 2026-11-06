
import DrawingCanvas from "../drawing/DrawingCanvas";

function DrawingRound({
    isDrawer,
    myWord,
    remainingTime,
    hint,
    onRequestHint
}) {
    const isLowTime = remainingTime <= 15;

    return (
        <section className="space-y-4">
            {/* Timer */}
            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 p-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Time remaining
                    </p>
                    <p
                        className={`mt-1 font-display text-3xl font-extrabold tabular-nums ${
                            isLowTime ? "text-red-400" : "text-white"
                        }`}
                    >
                        ⏱ {remainingTime}s
                    </p>
                </div>

                <span
                    className={`rounded-xl px-3 py-2 text-xs font-bold ${
                        isDrawer
                            ? "bg-violet-500/15 text-violet-300"
                            : "bg-emerald-500/15 text-emerald-300"
                    }`}
                >
                    {isDrawer ? "✏️ YOUR TURN" : "🔍 GUESS THE WORD"}
                </span>
            </div>

            {/* Word or Hint */}
            {isDrawer ? (
                <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-5 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-violet-300">
                        Your secret word
                    </p>

                    <h2 className="mt-2 font-display text-3xl font-extrabold tracking-wide text-white">
                        {myWord || "Loading..."}
                    </h2>

                    <p className="mt-2 text-xs text-violet-200/70">
                        Draw this word so other players can guess it!
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                                Word hint
                            </p>

                            <p className="mt-2 text-lg font-bold tracking-widest text-white">
                                {hint || "No letters revealed yet"}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onRequestHint}
                            disabled={!onRequestHint}
                            className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            💡 Request Hint
                        </button>
                    </div>
                </div>
            )}

            {/* Drawing Area */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-3 sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-bold text-white">
                        🎨 Drawing Area
                    </h3>

                    <span className="text-xs text-slate-500">
                        {isDrawer ? "You are drawing" : "Live drawing"}
                    </span>
                </div>

                <DrawingCanvas canDraw={isDrawer} />
            </div>
        </section>
    );
}

export default DrawingRound;
