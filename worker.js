var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var WebServer = require('./server/SocketClusterWebserver.js');
var AccessControl = require('./sc_module/access-control.js');
var Router = require('./sc_module/Router.js');

module.exports.run = function(worker) {
    console.log(" >> Worker PID:", process.pid);
    var httpServer = worker.httpServer;
    var scServer = worker.scServer;
    AccessControl.attach(scServer);

    var app = express();
    app.use(Router.attach(express));
    app.use(serveStatic(path.resolve(__dirname, 'public')));
    //app.use(serveStatic(path.resolve(__dirname, 'node_modules/socketcluster-client')));
    httpServer.on('request', app);

    var channel = scServer.exchange;
    /***************************************************************************
     *
     * 业务事件
     *
    ****************************************************************************/
    var webServer = WebServer.attach(scServer);
    webServer.on('new_socket', function (socket) {
        console.log("服务器  客户端数量", scServer.clientsCount, "Clients = " + Object.keys(scServer.clients).length);
        console.log("client " + socket.id + " has connected # pid=", process.pid);
    });

    /***************************************************************************
     *
     * 通道事件
     *
    ****************************************************************************/
    //建立一个通道向订阅的客户端发送服务器时间
    //setInterval(function () {
    //    channel.publish('time',{
    //        time:Date.now(),
    //        pid: process.pid,
    //        client:Object.keys(scServer.clients).length,
    //    });
    //}, 1000);
};