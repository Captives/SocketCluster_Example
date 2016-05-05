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
        console.log(text);
        var json = JSON.parse(text);
        if(json.event){
            that.emit(json.event, json.data, json.cid);
        }else{
            that.emit('message',json);
        }
    });

    //连接中断
    socket.on('connectAbort', function (code) {
        console.log('------连接中断 connectAbort -------',code);
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

