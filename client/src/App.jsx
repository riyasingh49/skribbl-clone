import { useEffect, useState } from "react";
import { socket } from "./socket/socket";

function App() {
    const [connectionStatus, setConnectionStatus] = useState("Disconnected");

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            console.log("Connected:", socket.id);
            setConnectionStatus("Connected");
        });

        socket.on("disconnect", () => {
            setConnectionStatus("Disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.disconnect();
        };
    }, []);

    return (
        <div style={{ padding: "40px", fontFamily: "Arial" }}>
            <h1>Skribbl Clone</h1>
            <h2>Socket Status: {connectionStatus}</h2>
            <p>Backend connection test</p>
        </div>
    );
}

export default App;
