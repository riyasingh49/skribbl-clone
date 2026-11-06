import React, { useState } from "react";

function RoomEntry({
    username,
    setUsername,
    roomId,
    setRoomId,
    onCreateRoom,
    onJoinRoom,
    roomSettings,
    setRoomSettings,
}) {
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState("");
    const [joinPassword, setJoinPassword] = useState("");
    const [entryError, setEntryError] = useState("");

    const inputClass =
        "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

    const labelClass = "text-sm font-semibold text-slate-300";

    const handleCreate = () => {
        setEntryError("");

        if (!username.trim()) {
            setEntryError("Please enter your name first.");
            return;
        }

        if (isPrivate && password.trim().length < 4) {
            setEntryError("Private room password must be at least 4 characters.");
            return;
        }

        onCreateRoom({
            isPrivate,
            password: isPrivate ? password : "",
        });
    };

    const handleJoin = () => {
        setEntryError("");

        if (!username.trim()) {
            setEntryError("Please enter your name first.");
            return;
        }

        if (!roomId.trim()) {
            setEntryError("Please enter a room code.");
            return;
        }

        setRoomId(roomId.trim().toUpperCase());

        onJoinRoom({
            password: joinPassword,
        });
    };

    const updateSetting = (key, value) => {
        setRoomSettings((previous) => ({
            ...previous,
            [key]: value,
        }));
    };

    return (
        <section className="w-full py-8 sm:py-12">
            <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
                {/* Page heading */}
                <div className="mb-8 text-center sm:mb-10">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10 text-3xl shadow-lg shadow-violet-950/20">
                        🎨
                    </div>

                    <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        Let's play{" "}
                        <span className="text-violet-400">Skribbl!</span>
                    </h1>

                    <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400 sm:text-base">
                        Create a room with your friends or join an existing
                        game. Draw, guess, and have fun!
                    </p>
                </div>

                {/* Username */}
                <div className="mx-auto mb-6 max-w-xl rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl shadow-black/10 sm:p-6">
                    <label htmlFor="player-name" className={labelClass}>
                        Your player name
                    </label>

                    <input
                        id="player-name"
                        type="text"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault();
                                handleCreate();
                            }
                        }}
                        placeholder="Enter your name..."
                        maxLength={20}
                        className={inputClass}
                    />

                    <p className="mt-2 text-xs text-slate-500">
                        This name will be visible to other players.
                    </p>
                </div>

                {/* Error message */}
                {entryError && (
                    <div
                        role="alert"
                        className="mx-auto mb-6 max-w-xl rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                        {entryError}
                    </div>
                )}

                {/* Create and join cards */}
                <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 md:gap-6">
                    {/* Create room */}
                    <div className="flex flex-col rounded-2xl border border-violet-500/25 bg-gradient-to-b from-violet-500/[0.08] to-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6">
                        <div className="mb-6 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-2xl">
                                ✨
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Create a room
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Start a new game and invite your friends.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="max-players"
                                    className={labelClass}
                                >
                                    Maximum players
                                </label>

                                <select
                                    id="max-players"
                                    value={roomSettings.maxPlayers}
                                    onChange={(event) =>
                                        updateSetting(
                                            "maxPlayers",
                                            Number(event.target.value)
                                        )
                                    }
                                    className={inputClass}
                                >
                                    {[2, 3, 4, 5, 6, 7, 8].map((number) => (
                                        <option
                                            key={number}
                                            value={number}
                                            className="bg-slate-900"
                                        >
                                            {number} players
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="total-rounds"
                                    className={labelClass}
                                >
                                    Number of rounds
                                </label>

                                <select
                                    id="total-rounds"
                                    value={roomSettings.totalRounds}
                                    onChange={(event) =>
                                        updateSetting(
                                            "totalRounds",
                                            Number(event.target.value)
                                        )
                                    }
                                    className={inputClass}
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                        (number) => (
                                            <option
                                                key={number}
                                                value={number}
                                                className="bg-slate-900"
                                            >
                                                {number}{" "}
                                                {number === 1 ? "round" : "rounds"}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="draw-time"
                                    className={labelClass}
                                >
                                    Drawing time
                                </label>

                                <select
                                    id="draw-time"
                                    value={roomSettings.drawTime}
                                    onChange={(event) =>
                                        updateSetting(
                                            "drawTime",
                                            Number(event.target.value)
                                        )
                                    }
                                    className={inputClass}
                                >
                                    {[30, 45, 60, 80, 90, 120, 150, 180].map(
                                        (seconds) => (
                                            <option
                                                key={seconds}
                                                value={seconds}
                                                className="bg-slate-900"
                                            >
                                                {seconds} seconds
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* Private room toggle */}
                            <div className="rounded-xl border border-slate-700/80 bg-slate-950/50 p-4">
                                <label className="flex cursor-pointer items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-semibold text-white">
                                            Private room
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Require a password to join.
                                        </p>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={isPrivate}
                                        onChange={(event) => {
                                            setIsPrivate(event.target.checked);
                                            setPassword("");
                                        }}
                                        className="h-5 w-5 accent-violet-500"
                                    />
                                </label>

                                {isPrivate && (
                                    <div className="mt-4">
                                        <label
                                            htmlFor="create-password"
                                            className={labelClass}
                                        >
                                            Room password
                                        </label>

                                        <input
                                            id="create-password"
                                            type="password"
                                            value={password}
                                            onChange={(event) =>
                                                setPassword(event.target.value)
                                            }
                                            placeholder="At least 4 characters"
                                            className={inputClass}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="mt-6 w-full rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition hover:bg-violet-500 active:scale-[0.98]"
                        >
                            Create room
                            <span className="ml-2">→</span>
                        </button>
                    </div>

                    {/* Join room */}
                    <div className="flex flex-col rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/[0.06] to-slate-900 p-5 shadow-xl shadow-black/10 sm:p-6">
                        <div className="mb-6 flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                                🚀
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Join a room
                                </h2>
                                <p className="mt-1 text-sm text-slate-400">
                                    Have a room code? Jump into the game.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="room-code"
                                    className={labelClass}
                                >
                                    Room code
                                </label>

                                <input
                                    id="room-code"
                                    type="text"
                                    value={roomId}
                                    onChange={(event) =>
                                        setRoomId(
                                            event.target.value.toUpperCase()
                                        )
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleJoin();
                                        }
                                    }}
                                    placeholder="ENTER ROOM CODE"
                                    maxLength={12}
                                    className={`${inputClass} text-center font-mono text-lg font-bold uppercase tracking-[0.2em]`}
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    Ask the room host for the invite code.
                                </p>
                            </div>

                            <div>
                                <label
                                    htmlFor="join-password"
                                    className={labelClass}
                                >
                                    Room password{" "}
                                    <span className="font-normal text-slate-500">
                                        (if required)
                                    </span>
                                </label>

                                <input
                                    id="join-password"
                                    type="password"
                                    value={joinPassword}
                                    onChange={(event) =>
                                        setJoinPassword(event.target.value)
                                    }
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            event.preventDefault();
                                            handleJoin();
                                        }
                                    }}
                                    placeholder="Enter room password"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="mt-auto">
                            <div className="my-6 rounded-xl border border-slate-700/70 bg-slate-950/40 p-4">
                                <p className="text-sm font-semibold text-white">
                                    Ready to play?
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    You'll enter the room lobby where you can
                                    see other players before the game starts.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleJoin}
                                className="w-full rounded-xl border border-cyan-400/20 bg-cyan-500/15 px-5 py-3.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-500/25 active:scale-[0.98]"
                            >
                                Join room
                                <span className="ml-2">→</span>
                            </button>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-center text-xs text-slate-600">
                    Draw something amazing. Guess something unexpected. Have fun!
                </p>
            </div>
        </section>
    );
}

export default RoomEntry;
