import { useState } from "react";
import useChat from "../../hooks/chat/useChat";

function ChatPanel() {
    const [message, setMessage] = useState("");

    const {
        messages,
        error,
        feedback,
        sendMessage,
    } = useChat();

    const handleSendMessage = async (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        const sent = await sendMessage(trimmedMessage);

        if (sent) {
            setMessage("");
        }
    };

    return (
        <div
            style={{
                width: "300px",
                height: "450px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <h3>Room Chat</h3>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    marginBottom: "10px",
                }}
            >
                {messages.map((msg, index) => (
                    <p key={`${msg.id}-${msg.timestamp}-${index}`}>
                        <strong>{msg.username}: </strong>
                        {msg.message}
                    </p>
                ))}
            </div>

            {feedback && (
                <p style={{ color: "green" }}>{feedback}</p>
            )}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            <form onSubmit={handleSendMessage}>
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type a message..."
                    maxLength={200}
                    style={{ width: "100%", padding: "8px" }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        marginTop: "8px",
                        padding: "8px",
                    }}
                >
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatPanel;
