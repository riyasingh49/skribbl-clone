function AppHeader({ connectionStatus }) {
    return (
        <header>
            <h1>Skribbl Clone</h1>
            <p>
                Socket Status:{" "}
                <strong>{connectionStatus}</strong>
            </p>
        </header>
    );
}

export default AppHeader;
