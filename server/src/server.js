require("dotenv").config();

const http = require("http");
const app = require("./app");

const initializeSocket = require("./config/socket");
const registerSocketHandlers = require("./socket/socketHandler");

const PORT = process.env.PORT || 5001;

// Create HTTP server
const httpServer = http.createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Register socket events
registerSocketHandlers(io);

// Start server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
