var EventEmitter = require('events').EventEmitter;
var Auth = require('./../sc_module/authentication.js');
var Remote = require('./../resource/RemoteResource.js');

function WebServer() {
    //远程消息管理对象
    this.remote = new Remote();
    //存放服务器上接入所有socket对象,不分组
    this.clientSockets = [];
    //存放服务器上接入所有房间room列表,不分组(以room为键名,值为为socket对象集合)
    this.roomList = {};

    this.on('join', function (ws, data) {

    });

    this.on("share", function (ws, data) {

    });

    this.on("offline", function (ws, data) {

    });

    this.remote.on("error", function (error, id) {
        if (error) {
            console.log("Send Error:", error, id);
        }
    });
}

WebServer.prototype = new EventEmitter();

WebServer.prototype.init = function (socket) {
    var that = this;
    this.emit("new_socket",socket);
    //消息
    socket.on('message', function (json) {
        //console.log('------ socket # message -------',data);
        if (json.eventName) {
            console.log("EventName", json.eventName);
            that.emit(json.eventName, socket, json.data);
        } else {
            that.emit("message", socket, json);
        }
    });

    socket.on('raw', function (data) {
        console.log('------ socket # raw -------',data);
    });

    //断开
    socket.on('disconnect', function (data) {
        console.log("Client " + socket.id + " socket has disconnected!");
    });

    //订阅
    socket.on('subscribe', function (name) {
        console.log('------ socket # subscribe -------',name);
    });

    //取消订阅
    socket.on('unsubscribe', function (name) {
        console.log('------ socket # unsubscribe -------',name);
    });

    //失败验证
    socket.on('badAuthToken', function (data) {
        console.log('------ socket # badAuthToken -------',data);
    });

    //错误
    socket.on('error', function (err) {
        console.error(err);
    });
};

module.exports.attach = function (scServer) {
    var webServer = new WebServer();
    scServer.webServer = webServer;
    scServer.on('connection', function (socket) {
       Auth.attach(socket);//身份验证的中间件
       webServer.init(socket);
    });
    return webServer;
};