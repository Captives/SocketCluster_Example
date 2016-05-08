function WebServerUtils() {
    this.webServerClient = null;
    function WebServerClient() {
        //this.channelTime = null;
    }

    WebServerClient.prototype = new RemoteClient();
    /**********************************************************
     *  单例模式对象
     **********************************************************/
    //
    //WebServerClient.prototype.subscribeTime = function (name) {
    //    if(this.isSubscribed(name)){
    //        return this.emit('error',new Error("名称为" + name +"通道已经被订阅了！不需要重复订阅"));
    //    }
    //
    //    this.channelTime = this.subscribe(name);
    //    this.channelTime.watch(function (data) {
    //        console.log(JSON.stringify(data));
    //    });
    //};
    //
    //WebServerClient.prototype.unSubscribeTime = function (name) {
    //    if(!this.isSubscribed(name)){
    //        return this.emit('error',new Error("名称为" + name +"通道未被订阅！当前操作已取消"));
    //    }
    //
    //    this.channelTime.unwatch(function(){
    //
    //    });
    //};

    /**********************************************************
     *  单例模式对象
     **********************************************************/
    if (this.webServerClient === null) {
        this.webServerClient = new WebServerClient();
        console.log("SocketCluster Client init");
    }
    return this.webServerClient;
};

function RemoteClient() {
    this.socket = null;
    this.isAuthenticated = false;
};

RemoteClient.prototype = new EventEmitter();

RemoteClient.prototype.connect = function (options) {
    var that = this;
    var socket = this.socket = socketCluster.connect(options);
    socket.on('connect', function (status) {
        that.isAuthenticated = status.isAuthenticated;
        that.emit('socket_open',status);
        if(!that.isAuthenticated){
            that.login({account:18388886666});
        }
        console.log('------ connect -------',JSON.stringify(status));
    });

    //消息
    socket.on('message', function (text) {
        try{
            var json = JSON.parse(text);
            if(json.event){
                // console.log("$$EVENT", text, JSON.stringify(json));
                that.emit(json.event, json.data, json.cid);
            }else{
                // console.log("$$MESSAGE", text, JSON.stringify(json));
                that.emit('message',json);
            }

        }catch(e){
            console.log("##", text);
        }


    });

    //连接中断
    socket.on('connectAbort', function (code) {
        var info = {
            1001: 'Socket was disconnected',
            1002: 'A WebSocket protocol error was encountered',
            1003: 'Server terminated socket because it received invalid data',
            1005: 'Socket closed without status code',
            1006: 'Socket hung up',
            1007: 'Message format was incorrect',
            1008: 'Encountered a policy violation',
            1009: 'Message was too big to process',
            1010: 'Client ended the connection because the server did not comply with extension requirements',
            1011: 'Server encountered an unexpected fatal condition',
            4000: 'Server ping timed out',
            4001: 'Client pong timed out',
            4002: 'Server failed to sign auth token',
            4003: 'Failed to complete handshake',
            4004: 'Client failed to save auth token',
            4005: 'Did not receive #handshake from client before timeout',
            4006: 'Failed to bind socket to message broker',
            4007: 'Client connection establishment timed out'
        };
        console.log('------连接中断 connectAbort -------',code,info[code]);
    });

    socket.on('raw', function () {
        console.log('------ raw -------');
    });

    //踢出
    socket.on('kickOut', function (data) {
        console.log('------踢出 kickOut -------',data);
    });

    //认证
    socket.on('authenticate', function (data) {
        console.log('------认证 authenticate -------',data);
    });

    //认证状态更改
    socket.on('authStateChange', function (data) {
        console.log('------认证状态更改 authStateChange -------',JSON.stringify(data));
    });

    //移除认证
    socket.on("removeAuthToken", function (data) {
        that.isAuthenticated = false;
        console.log('------移除认证 removeAuthToken -------',data);
    });

    //订阅请求-2
    socket.on('subscribeRequest', function (name) {
        console.log('------订阅请求 subscribeRequest -------',name);
    });

    //订阅失败
    socket.on('subscribeFail', function (data) {
        console.log('------订阅失败 subscribeFail -------',data);
    });

    //订阅状态改变
    socket.on('subscribeStateChange', function (data) {
        console.log('------订阅状态改变 subscribeStateChange -------',data);
    });

    //订阅
    socket.on('subscribe', function (data) {
        console.log('------订阅 subscribe -------',data);
    });

    //取消订阅
    socket.on('unsubscribe', function (data) {
        console.log('------取消订阅 unsubscribe -------',data);
    });

    //解除验证
    socket.on('deauthenticate', function (data) {
        console.log('------解除验证 deauthenticate -------',data);
    });

    //断开
    socket.on("disconnect", function () {
        console.log(' --------- UNCONNECTED  -----------');
    });

    socket.on('error', function (err) {
        console.log(err);
    });

    socket.on('reject', function (data) {
        console.log('reject',data.text);
    });
};

RemoteClient.prototype.isSubscribed = function (name) {
    return this.socket.isSubscribed(name);
};

RemoteClient.prototype.subscribe = function (name) {
    return this.socket.subscribe(name);
};

RemoteClient.prototype.login = function (data) {
    var that = this;
    this.socket.emit('join', data, function (err, data) {
        if(err){
            console.log(err);
            that.isAuthenticated = false;
        }else{
            that.isAuthenticated = true;
            console.log(JSON.stringify(data));
        }
    });
};

