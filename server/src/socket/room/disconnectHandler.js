const { handlePlayerLeaving } = require("./roomUtils");
const registerDisconnectHandler = (
    io,
    socket,
    roomService,
    gameService
) => {

    socket.on("disconnect", (reason) => {
        console.log(
            `Player disconnected: ${socket.id}`,
            reason
        );

        const result = handlePlayerLeaving(
            io,
            socket,
            roomService,
            gameService
        );

        if (result) {
            console.log(
                `${result.player.username} removed from room ${result.roomId}`
            );
        }
    });
};

module.exports = registerDisconnectHandler;
