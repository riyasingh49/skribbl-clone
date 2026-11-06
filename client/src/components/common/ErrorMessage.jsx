
function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
        >
            <span className="text-lg" aria-hidden="true">
                ⚠️
            </span>

            <p className="min-w-0 break-words leading-relaxed">
                {message}
            </p>
        </div>
    );
}

export default ErrorMessage;
