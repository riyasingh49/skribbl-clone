const HINT_COOLDOWN = 15000;
const lastHintRequest = new Map();

const registerHintHandler = (io, socket, roomService, gameService) => {
    socket.on("request-hint", () => {
        try {
            const room = roomService.getRoomForSocket(socket.id);
            if (!room) return;

            const game = gameService.getGame(room.id);

            if (!game || game.roundStatus !== "drawing") {
                return;
            }

            const drawer = game.getCurrentDrawer();

            if (!drawer || drawer.id === socket.id) {
                return;
            }

            const now = Date.now();
            const lastRequest = lastHintRequest.get(room.id) || 0;

            if (now - lastRequest < HINT_COOLDOWN) {
                return;
            }

            lastHintRequest.set(room.id, now);

            const hint = game.revealLetter();

            io.to(room.id).emit("hint-updated", { hint });
        } catch (error) {
            console.error("Hint request failed:", error.message);
        }
    });
};

module.exports = registerHintHandler;