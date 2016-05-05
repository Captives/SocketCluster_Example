module.exports.attach = function (scServer) {
    var webServer = scServer.webServer;
    //握手
    scServer.addMiddleware(scServer.MIDDLEWARE_HANDSHAKE, function (req, next) {
        //console.log('middleware_handshake', req.remoteAddress,req.headers);
        if(req.headers.host == "192.168.10.131"){
            console.log("拒绝连接", process.pid);
            req.socket.emit('reject',{text:"黑名单用户,不能登录"});
        }else{
            next();
        }
    });

    //订阅
    scServer.addMiddleware(scServer.MIDDLEWARE_SUBSCRIBE, function (req, next) {
        console.log('middleware_subscribe',req.socket.id, req.channel);
        next();
    });

    //发布(客户端socket.publish())触发
    scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_IN, function (req, next) {
        console.log('middleware_publish_in',req.socket.id, req.channel, req.data);
        next();
    });

    //发布(服务器端scServer.exchange.publish)触发
    scServer.addMiddleware(scServer.MIDDLEWARE_PUBLISH_OUT, function (req, next) {
        console.log('middleware_publish_out',req.socket.id, req.channel, req.data);
        next();
    });

    //事件派发 ## 这里处理我自己的业务事件，外层只需要控制
    scServer.addMiddleware(scServer.MIDDLEWARE_EMIT, function (req, next) {
        try{
            console.log('middleware_emit',req.socket.id, req.event, req.data);
            //拦截事件处理业务
            //webServer.emit(req.event, req.socket, req.data);
            webServer[req.event](req.socket,req.data);
        }catch(e){
            req.socket.emit('reject',{text:"无效的业务事件"});
            console.error("无效的业务事件", req.event, req.data);
        }
        next();
    });

    //错误
    scServer.on('error', function (err) {
        console.log('------ scServer # error -------',err);
    });

    //通知
    scServer.on('notice', function () {
        console.log('------ scServer # notice -------');
    });

    //握手
    scServer.on('handshake', function () {
        console.log('------ scServer # handshake -------');
    });

    //认证失败
    scServer.on('badSocketAuthToken', function () {
        console.log('------ scServer # badSocketAuthToken -------');
    });
};