
import { useState, useRef, useEffect } from "react";
import useChat from "../../hooks/chat/useChat";

function ChatPanel() {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);

    const { messages, error, feedback, sendMessage } = useChat();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (event) => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        const sent = await sendMessage(trimmedMessage);

        if (sent) setMessage("");
    };

    return (
        <aside className="flex h-[500px] w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
            <header className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 text-xl">
                        💬
                    </div>

                    <div>
                        <h3 className="font-bold text-white">Room chat</h3>
                        <span className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Live conversation
                        </span>
                    </div>
                </div>

                <span className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300">
                    {messages.length}
                </span>
            </header>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-3 text-4xl">👋</div>
                        <strong className="text-sm text-slate-300">
                            It's quiet in here...
                        </strong>
                        <p className="mt-2 text-xs text-slate-500">
                            Say hello or be the first to guess!
                        </p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div
                            className="flex items-start gap-3"
                            key={`${msg.id}-${msg.timestamp}-${index}`}
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white">
                                {(msg.username || "?").charAt(0).toUpperCase()}
                            </div>

                            <div className="min-w-0 flex-1 rounded-xl rounded-tl-sm bg-slate-800/70 px-3 py-2">
                                <strong className="block truncate text-xs text-violet-300">
                                    {msg.username || "Player"}
                                </strong>
                                <p className="mt-1 break-words text-sm leading-relaxed text-slate-200">
                                    {msg.message}
                                </p>
                            </div>
                        </div>
                    ))
                )}

                <div ref={messagesEndRef} />
            </div>

            {feedback && (
                <p className="mx-4 mb-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
                    {feedback}
                </p>
            )}

            {error && (
                <p className="mx-4 mb-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-300">
                    {error}
                </p>
            )}

            <form
                className="flex gap-2 border-t border-slate-800 p-3"
                onSubmit={handleSendMessage}
            >
                <input
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Type your guess or message..."
                    maxLength={200}
                    aria-label="Chat message"
                    className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-500"
                />

                <button
                    type="submit"
                    disabled={!message.trim()}
                    aria-label="Send message"
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <span>Send</span>
                    <span>➤</span>
                </button>
            </form>

            <p className="border-t border-slate-800 px-3 py-2 text-center text-[10px] text-slate-600">
                Be nice. Have fun. Guess brilliantly.
            </p>
        </aside>
    );
}

export default ChatPanel;
