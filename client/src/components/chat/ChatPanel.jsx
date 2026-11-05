import { useEffect, useState } from "react";
import { socket } from "../../socket/socket";

function ChatPanel() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [notifications, setNotifications] = useState([]);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const handleChatMessage = (newMessage) => {
            setMessages((previousMessages) => [
                ...previousMessages,
                newMessage,
            ]);
        };

        const handleCorrectGuess = (data) => {
            setNotifications((previous) => [
                ...previous,
                `${data.username} guessed the word correctly!`,
            ]);
        };

        socket.on("correct-guess", handleCorrectGuess);

        socket.on("chat-message", handleChatMessage);

        return () => {
            socket.off("chat-message", handleChatMessage);
            socket.off("correct-guess", handleCorrectGuess);
        };
    }, []);

    const handleSendMessage = (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        setFeedback("");

        socket.emit(
            "send-message",
            { message: trimmedMessage },
            (response) => {
                if (!response?.success) {
                    setFeedback(response?.error || "Message could not be sent");
                    return;
                }

                if (response.correct) {
                    setFeedback("Correct answer! Well done!");
                } else if (response.incorrectGuess) {
                    setFeedback("Wrong answer! Try again.");
                }

                setMessage("");
            }
        );
    };

    return (
        <div style={{
            width: "300px",
            height: "450px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
        }}>
            <h3>Room Chat</h3>

            <div style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "10px",
            }}>
                {notifications.map((notification, index) => (
                    <p
                        key={index}
                        style={{
                            color: "green",
                            fontWeight: "bold",
                        }}
                    >
                        {notification}
                    </p>
                ))}
                {messages.map((msg, index) => (
                    <p key={`${msg.id}-${msg.timestamp}-${index}`}>
                        <strong>{msg.username}: </strong>
                        {msg.message}
                    </p>
                ))}
                {feedback && (
                    <p
                        style={{
                            color: feedback.startsWith("Wrong")
                                ? "red"
                                : feedback.startsWith("Correct")
                                    ? "green"
                                    : "orange",
                            fontWeight: "bold",
                        }}
                    >
                        {feedback}
                    </p>
                )}
            </div>

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

                <button type="submit" style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "8px",
                }}>
                    Send
                </button>
            </form>
        </div>
    );
}

export default ChatPanel;
