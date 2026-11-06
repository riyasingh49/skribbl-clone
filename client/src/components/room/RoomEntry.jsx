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

        onCreateRoom({
            isPrivate,
            password
        });
    };

    const handleJoin = () => {
        setEntryError("");

        if (!username.trim() || !roomId.trim()) {
            setEntryError("Enter your username and room ID.");
            return;
        }

        setRoomId(roomId.trim().toUpperCase());

        onJoinRoom({
            password: joinPassword
        });
    };

    return (
        <section className="room-entry">
            <h2>Welcome to Skribbl Clone</h2>

            <label htmlFor="username">Username</label>
            <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter your username"
                maxLength={20}
            />

            <div className="create-room-section">
                <h3>Create a Room</h3>

                <label>
                    Maximum Players
                    <select
                        value={roomSettings.maxPlayers}
                        onChange={(event) =>
                            updateSetting("maxPlayers", Number(event.target.value))
                        }
                    >
                        {[2, 3, 4, 5, 6, 7, 8].map((number) => (
                            <option key={number} value={number}>
                                {number}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Total Rounds
                    <select
                        value={roomSettings.totalRounds}
                        onChange={(event) =>
                            updateSetting("totalRounds", Number(event.target.value))
                        }
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                            <option key={number} value={number}>
                                {number}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Drawing Time
                    <select
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

                <label>
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={(event) => setIsPrivate(event.target.checked)}
                    />
                    Create a private room
                </label>

                {isPrivate && (
                    <label>
                        Room Password
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="At least 4 characters"
                            minLength={4}
                            maxLength={32}
                        />
                    </label>
                )}

                <button onClick={handleCreate}>
                    Create Room
                </button>
            </div>

            <div className="join-room-section">
                <h3>Join a Room</h3>

                <label htmlFor="room-id">Room ID</label>
                <input
                    id="room-id"
                    type="text"
                    value={roomId}
                    onChange={(event) => setRoomId(event.target.value.toUpperCase())}
                    placeholder="Enter room ID"
                />

                <label htmlFor="join-password">Room Password (private rooms only)</label>
                <input
                    id="join-password"
                    type="password"
                    value={joinPassword}
                    onChange={(event) => setJoinPassword(event.target.value)}
                    placeholder="Enter password if required"
                />

                <button onClick={handleJoin}>
                    Join Room
                </button>
            </div>

            {entryError && (
                <p className="error-message">{entryError}</p>
            )}
        </section>
    );
}

export default RoomEntry;
