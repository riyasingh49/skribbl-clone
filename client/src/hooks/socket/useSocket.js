import { useEffect, useState } from "react";
import { socket } from "../../socket/socket";

function useSocket() {
    const [connectionStatus, setConnectionStatus] =
        useState("Disconnected");

    useEffect(() => {
        const handleConnect = () => {
            setConnectionStatus("Connected");
        };

        const handleDisconnect = () => {
            setConnectionStatus("Disconnected");
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);

        socket.connect();

        // Handle an already-connected socket.
        if (socket.connected) {
            setConnectionStatus("Connected");
        }

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.disconnect();
        };
    }, []);

    return { connectionStatus };
}

export default useSocket;
