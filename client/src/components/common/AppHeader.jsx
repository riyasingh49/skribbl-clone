
function AppHeader({ connectionStatus }) {
    const isConnected = connectionStatus === "Connected";

    return (
        <header className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 shadow-lg">
            <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                    🎨 Skribbl Clone
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                    Draw, guess and have fun with friends!
                </p>
            </div>

            <div
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                    isConnected
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/20 bg-red-500/10 text-red-400"
                }`}
            >
                <span
                    className={`h-2 w-2 rounded-full ${
                        isConnected ? "bg-emerald-400" : "bg-red-400"
                    }`}
                />
                {connectionStatus || "Connecting..."}
            </div>
        </header>
    );
}

export default AppHeader;
