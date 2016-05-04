function WebServerUtils() {
    this.webServerClient = null;
    function WebServerClient() {
        this.remote = null;
        this.data = null;
    }

    WebServerClient.prototype = new EventEmitter();
    /**********************************************************
     *  单例模式对象
     **********************************************************/

    WebServerClient.prototype.connect = function () {
        var that = this;
        this.remote = new RemoteClient({
            path:'/socket'
        });

        var socket = this.remote.webSocket;
        socket.on('logout', function (data) {
            alert(data.text);
        });

        socket.on('connect', function (status) {
            that.subscribeTime("time");
        });

        //消息
        socket.on('message', function (data) {
            that.emit('message',data);
            //console.log('------ message -------',data);
        });

        socket.on('time', function (data) {
            var date = new Date();
            date.setTime = data.time;
            $('#time').html(date.toLocaleDateString() + date.toLocaleTimeString());
            $('#pid').html("client="+data.client);
        });

        //登录成功
        socket.on("success", function (data) {
           $('#pid').html("进程ID:" + data.pid);
        });
    };

    WebServerClient.prototype.subscribeTime = function (name) {
        if(this.remote.isSubscribed(name)){
            return this.emit('error',new Error("名称为" + name +"通道已经被订阅了！不需要重复订阅"));
        }

        var channel = this.remote.subscribe(name);
        channel.watch(function (data) {
            console.log(JSON.stringify(data));
        });
    };

    /**********************************************************
     *  单例模式对象
     **********************************************************/
    if (this.webServerClient === null) {
        this.webServerClient = new WebServerClient();
        console.log("WebSocket Client init");
    }
    return this.webServerClient;
};

function RemoteClient(options) {
    var socket = socketCluster.connect(options);
    Object.defineProperties(this,{
        "webSocket":{
            get:function(){
                return socket;
            }
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
        console.log('------认证状态更改 authStateChange -------',data);
    });

    //移除认证
    socket.on("removeAuthToken", function (data) {
        isAuthenticated = false;
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
};

RemoteClient.prototype.isSubscribed = function (name) {
    return this.webSocket.isSubscribed(name);
};
RemoteClient.prototype.subscribe = function (name) {
    return this.webSocket.subscribe(name);
};