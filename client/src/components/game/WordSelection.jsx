function WordSelection({
    isDrawer,
    isChoosingWord,
    wordChoices,
    drawerName,
    onSelectWord
}) {
    if (!isChoosingWord) return null;

    if (!isDrawer) {
        return (
            <div className="flex flex-col items-center py-10 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 text-3xl">
                    🎨
                </div>

                <p className="mb-2 text-xs font-bold tracking-[0.2em] text-violet-400">
                    WORD SELECTION
                </p>

                <h3 className="text-xl font-bold text-white">
                    {drawerName || "The artist"} is choosing a word
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                    Get ready to guess. The drawing round will begin soon.
                </p>

                <div className="mt-6 flex gap-2">
                    {[0, 1, 2].map((dot) => (
                        <span
                            key={dot}
                            className="h-2 w-2 animate-pulse rounded-full bg-violet-400"
                            style={{ animationDelay: `${dot * 200}ms` }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-7 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-2xl">
                    💡
                </div>

                <p className="mb-2 text-xs font-bold tracking-[0.2em] text-violet-400">
                    YOUR TURN TO DRAW
                </p>

                <h3 className="text-2xl font-bold text-white">
                    Choose your secret word
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                    Pick one word. Your room will try to guess what you draw.
                </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                {wordChoices.map((word, index) => (
                    <button
                        key={word}
                        type="button"
                        onClick={() => onSelectWord?.(word)}
                        className="group flex min-h-28 items-center justify-between rounded-2xl border border-slate-700 bg-slate-950/70 p-5 text-left transition hover:-translate-y-1 hover:border-violet-400/60 hover:bg-violet-500/10 active:scale-[0.98]"
                    >
                        <div>
                            <span className="mb-3 block text-xs font-bold tracking-widest text-violet-400">
                                OPTION 0{index + 1}
                            </span>

                            <strong className="text-lg text-white transition group-hover:text-violet-300">
                                {word}
                            </strong>
                        </div>

                        <span className="text-xl text-slate-600 transition group-hover:translate-x-1 group-hover:text-violet-400">
                            →
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default WordSelection;
