
function RoundResult({ correctWord }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-6 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-4xl">
                🎉
            </div>

            <h3 className="mt-4 font-display text-2xl font-extrabold text-white">
                Round Finished!
            </h3>

            <p className="mt-2 text-sm text-slate-400">
                Great effort, everyone!
            </p>

            {correctWord && (
                <div className="mx-auto mt-5 max-w-sm rounded-xl border border-emerald-500/20 bg-slate-950/70 p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                        Correct word
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-wide text-white">
                        {correctWord}
                    </p>
                </div>
            )}
        </section>
    );
}

export default RoundResult;
