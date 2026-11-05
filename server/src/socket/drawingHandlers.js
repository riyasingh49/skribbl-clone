const registerDrawingHandlers = (io, socket, roomService, gameService) => {

    socket.on("draw-line", (data) => {
        try {
            const room = roomService.getRoomForSocket(socket.id);
            if (!room) return;
            const game = gameService.getGame(room.id);
            if (!game || game.roundStatus !== "drawing") return;
            // Only the current drawer can draw
            const currentDrawer = game.getCurrentDrawer();
            if (!currentDrawer || currentDrawer.id !== socket.id) {
                return;
            }
            const { from, to, color, lineWidth, strokeId } = data || {};  
            
            // Validate coordinates

            if (typeof strokeId !== "string" || !strokeId) {
                return;
            }
            if (
                !from ||
                !to ||
                !Number.isFinite(from.x) ||
                !Number.isFinite(from.y) ||
                !Number.isFinite(to.x) ||
                !Number.isFinite(to.y)
            ) {
                return;
            }

            // Validate drawing style
            if (
                typeof color !== "string" ||
                !/^#[0-9A-Fa-f]{6}$/.test(color) ||
                !Number.isFinite(lineWidth) ||
                lineWidth < 1 ||
                lineWidth > 30
            ) {
                return;
            }

            // Send drawing data to everyone except the drawer
            socket.to(room.id).emit("draw-line", {
                from,
                to,
                color,
                lineWidth,
                strokeId
            });

        } catch (error) {
            console.error("Drawing error:", error.message);
        }
    });

    socket.on("undo-drawing", (data) => {
        const room = roomService.getRoomForSocket(socket.id);
        if (!room) return;
    
        const game = gameService.getGame(room.id);
        if (!game || game.roundStatus !== "drawing") return;
    
        const currentDrawer = game.getCurrentDrawer();
        if (!currentDrawer || currentDrawer.id !== socket.id) return;
    
        const { strokeId } = data || {};
    
        if (typeof strokeId !== "string" || !strokeId) return;
    
        socket.to(room.id).emit("undo-drawing", { strokeId });
    });

    socket.on("clear-canvas", () => {
        const room = roomService.getRoomForSocket(socket.id);
        if (!room) return;
    
        const game = gameService.getGame(room.id);
        if (!game || game.roundStatus !== "drawing") return;
    
        const currentDrawer = game.getCurrentDrawer();
    
        if (!currentDrawer || currentDrawer.id !== socket.id) return;
    
        socket.to(room.id).emit("clear-canvas");
    });
};

module.exports = registerDrawingHandlers;
