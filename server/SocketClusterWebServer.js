var EventEmitter = require('events').EventEmitter;
var Remote = require('./../resource/RemoteResource.js');

var remote = new Remote();
remote.on("error", function (error, id) {
    if (error) {
        console.log("Send Error:", error, id);
    }
});

var  WebServer = {};
//存放服务器上接入所有socket对象,不分组
WebServer.clientSockets = [];
//存放服务器上接入所有房间room列表,不分组(以room为键名,值为为socket对象集合)
WebServer.roomList = {};

WebServer.init = function (socket, data) {

};

WebServer.join = function (socket, data) {
    socket.emit('success',{text:"登录成功"});
    console.log("[WEBSERVER]---------join----------------");
};

WebServer.share = function (socket, data) {

};

WebServer.offline = function (socket, data) {

};

WebServer.disconnect = function (socket, data) {

};

WebServer.syncTime = function (channel, time, pid, num) {
    console.log("------ syncTime --------");
    channel.publish('time',{
        time:time,
        pid: pid,
        client:num
    });
};
module.exports = WebServer;