import { useEffect, useState, useCallback } from "react";
import { socket } from "../../socket/socket";

function useChat() {
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        const handleChatMessage = (newMessage) => {
            setMessages((previous) => [
                ...previous,
                newMessage,
            ]);
        };

        const handleCorrectGuess = (data) => {
            setFeedback(`${data.username} guessed correctly!`);
        };

        socket.on("chat-message", handleChatMessage);
        socket.on("correct-guess", handleCorrectGuess);

        return () => {
            socket.off("chat-message", handleChatMessage);
            socket.off("correct-guess", handleCorrectGuess);
        };
    }, []);

    const sendMessage = useCallback((message) => {
        return new Promise((resolve) => {
            socket.emit(
                "send-message",
                { message },
                (response) => {
                    if (!response?.success) {
                        setError(
                            response?.error || "Message could not be sent"
                        );
                        resolve(false);
                        return;
                    }

                    setError("");
                    
                    if (response.correct) {
                        setFeedback("You guessed correctly!");
                    } else if (response.incorrectGuess) {
                        setFeedback("Not quite! Try again.");
                    } else {
                        setFeedback("");
                    }

                    resolve(true);
                }
            );
        });
    }, []);

    return {
        messages,
        error,
        feedback,
        sendMessage,
    };
}

export default useChat;
