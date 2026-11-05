import { useState, useEffect, useCallback } from "react";
import { socket } from "../../socket/socket";

function useRoom() {
    const [roomData, setRoomData] = useState(null);
    const [roomId, setRoomId] = useState("");

   
useEffect(() => {
    const handleRoomUpdated = (room) => {
        setRoomData(room);
    };

    const handlePlayerLeft = (player) => {
        console.log(`${player.username} left the room`);
    };

    const handleScoresUpdated = (data) => {
        setRoomData((previous) => {
            if (!previous) return previous;

            return {
                ...previous,
                players: data.players,
            };
        });
    };

    socket.on("room-updated", handleRoomUpdated);
    socket.on("player-left", handlePlayerLeft);
    socket.on("scores-updated", handleScoresUpdated);

    return () => {
        socket.off("room-updated", handleRoomUpdated);
        socket.off("player-left", handlePlayerLeft);
        socket.off("scores-updated", handleScoresUpdated);
    };
}, []);


    const createRoom = useCallback((username, onError) => {
        socket.emit(
            "create-room",
            {
                username,
                settings: {
                    maxPlayers: 6,
                    totalRounds: 3,
                    drawTime: 80,
                },
            },
            (response) => {
                if (response.success) {
                    setRoomData(response.room);
                    setRoomId(response.room.id);
                } else {
                    onError(response.error);
                }
            }
        );
    }, []);

    const joinRoom = useCallback((username, onError) => {
        socket.emit(
            "join-room",
            {
                username,
                roomId,
            },
            (response) => {
                if (response.success) {
                    setRoomData(response.room);
                } else {
                    onError(response.error);
                }
            }
        );
    }, [roomId]);

    const leaveRoom = useCallback((onError, onSuccess) => {
        socket.emit("leave-room", (response) => {
            if (response.success) {
                setRoomData(null);
                setRoomId("");
                onSuccess?.();
            } else {
                onError(response.error);
            }
        });
    }, []);

    return {
        roomData,
        setRoomData,
        roomId,
        setRoomId,
        createRoom,
        joinRoom,
        leaveRoom,
    };
}

export default useRoom;
