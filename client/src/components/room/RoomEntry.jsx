
import React from "react";

function RoomEntry({
    username,
    setUsername,
    roomId,
    setRoomId,
    onCreateRoom,
    onJoinRoom,
    roomSettings,
    setRoomSettings
}) {
    const [isPrivate, setIsPrivate] = React.useState(false);
    const [password, setPassword] = React.useState("");
    const [joinPassword, setJoinPassword] = React.useState("");
    const [entryError, setEntryError] = React.useState("");

    const updateSetting = (key, value) => {
        setRoomSettings((previous) => ({
            ...previous,
            [key]: value
        }));
    };

    const handleCreate = () => {
        setEntryError("");

        if (!username.trim()) {
            setEntryError("Please enter your username.");
            return;
        }

        if (isPrivate && password.length < 4) {
            setEntryError("Private room password must be at least 4 characters.");
            return;
        }

        onCreateRoom({ isPrivate, password });
    };

    const handleJoin = () => {
        setEntryError("");

        if (!username.trim() || !roomId.trim()) {
            setEntryError("Enter your username and room ID.");
            return;
        }

        setRoomId(roomId.trim().toUpperCase());
        onJoinRoom({ password: joinPassword });
    };

    const inputClass =
        "w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

    const labelClass =
        "mb-2 block text-sm font-medium text-slate-300";

    const selectClass =
        `${inputClass} cursor-pointer`;

    const buttonClass =
        "w-full rounded-xl bg-violet-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.98]";

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d1019] px-4 py-12 text-white">
            <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-5xl">
                <header className="mb-10 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/15 text-3xl shadow-lg shadow-violet-950/30">
                        🎨
                    </div>

                    <p className="mb-3 text-xs font-bold tracking-[0.3em] text-violet-400">
                        DRAW · GUESS · WIN
                    </p>

                    <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                        Skribbl<span className="text-violet-400">.</span>
                    </h1>

                    <p className="mt-3 text-sm text-slate-400 sm:text-base">
                        Bring your friends. Show your creativity. Guess the impossible.
                    </p>
                </header>

                <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
                    <div className="mb-7">
                        <label htmlFor="username" className={labelClass}>
                            Your player name
                        </label>

                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            placeholder="Enter your username"
                            maxLength={20}
                            className={inputClass}
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/15 text-xl">
                                    ✨
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Create a room</h2>
                                    <p className="text-xs text-slate-500">Start your own match</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block">
                                    <span className={labelClass}>Maximum players</span>
                                    <select
                                        className={selectClass}
                                        value={roomSettings.maxPlayers}
                                        onChange={(event) =>
                                            updateSetting("maxPlayers", Number(event.target.value))
                                        }
                                    >
                                        {[2, 3, 4, 5, 6, 7, 8].map((number) => (
                                            <option key={number} value={number}>
                                                {number} players
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className={labelClass}>Total rounds</span>
                                    <select
                                        className={selectClass}
                                        value={roomSettings.totalRounds}
                                        onChange={(event) =>
                                            updateSetting("totalRounds", Number(event.target.value))
                                        }
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                                            <option key={number} value={number}>
                                                {number} rounds
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="block">
                                    <span className={labelClass}>Drawing time</span>
                                    <select
                                        className={selectClass}
                                        value={roomSettings.drawTime}
                                        onChange={(event) =>
                                            updateSetting("drawTime", Number(event.target.value))
                                        }
                                    >
                                        {[30, 45, 60, 80, 90, 120, 150, 180].map((seconds) => (
                                            <option key={seconds} value={seconds}>
                                                {seconds} seconds
                                            </option>
                                        ))}
                                    </select>
                                </label>

                                <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-3">
                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={(event) => setIsPrivate(event.target.checked)}
                                        className="h-4 w-4 accent-violet-500"
                                    />
                                    <span className="text-sm font-medium text-slate-300">
                                        Create a private room
                                    </span>
                                </label>

                                {isPrivate && (
                                    <label className="block">
                                        <span className={labelClass}>Room password</span>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(event) => setPassword(event.target.value)}
                                            placeholder="At least 4 characters"
                                            minLength={4}
                                            maxLength={32}
                                            className={inputClass}
                                        />
                                    </label>
                                )}

                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    className={buttonClass}
                                >
                                    Create room <span className="ml-2">→</span>
                                </button>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-xl">
                                    🚀
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold">Join a room</h2>
                                    <p className="text-xs text-slate-500">Play with your friends</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block">
                                    <span className={labelClass}>Room code</span>
                                    <input
                                        id="room-id"
                                        type="text"
                                        value={roomId}
                                        onChange={(event) =>
                                            setRoomId(event.target.value.toUpperCase())
                                        }
                                        placeholder="Enter room code"
                                        className={`${inputClass} uppercase tracking-widest`}
                                    />
                                </label>

                                <label className="block">
                                    <span className={labelClass}>Room password</span>
                                    <input
                                        type="password"
                                        value={joinPassword}
                                        onChange={(event) => setJoinPassword(event.target.value)}
                                        placeholder="If the room is private"
                                        className={inputClass}
                                    />
                                </label>

                                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                                    <p className="text-sm font-medium text-slate-300">
                                        Have a room code?
                                    </p>
                                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                                        Enter the code shared by your friend to join their game.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleJoin}
                                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-5 py-3.5 font-semibold text-white transition hover:border-cyan-400/40 hover:bg-slate-700 active:scale-[0.98]"
                                >
                                    Join room <span className="ml-2">→</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {entryError && (
                        <p
                            role="alert"
                            className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                        >
                            {entryError}
                        </p>
                    )}
                </section>

                <p className="mt-6 text-center text-xs text-slate-600">
                    Made for creative minds and friendly competition.
                </p>
            </div>
        </main>
    );
}

export default RoomEntry;
