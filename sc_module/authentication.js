module.exports.attach = function (pool, socket) {
    socket.on('join', function (data, respond) {
        var sql = "SELECT * FROM users WHERE phone=? OR email=?";
        pool.query(sql,[data.account,data.account], function (err, rows) {
          //  console.log(JSON.stringify(data),rows);
            if(err){
                console.error(err);
                respond(err);
            }else{
                if(rows.length){//此处未校验密码
                    socket.setAuthToken(rows);
                    respond(null,rows);
                }else{
                    respond("该账户不存在");
                }
            }
        });
    });

    //用户退出
    socket.once('exit', function (data) {
        socket.deauthenticate();
        console.log("----- exit ------");
    });

    socket.once('disconnect', function (data) {
        console.log("[MIDDLEWARE] Client " + socket.id + " socket has disconnected!");
    });
};