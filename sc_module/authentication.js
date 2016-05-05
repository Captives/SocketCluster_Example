module.exports.attach = function (socket) {
    socket.on('join', function (data, respond) {
        console.log("[MIDDLEWARE]---------join----------------");
    });

    socket.once('disconnect', function (data) {
        console.log("[MIDDLEWARE] Client " + socket.id + " socket has disconnected!");
    });
};