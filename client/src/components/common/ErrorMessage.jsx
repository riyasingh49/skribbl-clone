function ErrorMessage({ message }) {
    if (!message) return null;

    return (
        <p
            role="alert"
            style={{
                color: "red",
                marginTop: "16px"
            }}
        >
            {message}
        </p>
    );
}

export default ErrorMessage;
