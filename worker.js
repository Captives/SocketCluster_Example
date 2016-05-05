var express = require('express');
var serveStatic = require('serve-static');
var path = require('path');
var WebServer = require('./server/SocketClusterWebserver.js');
var AccessControl = require('./sc_module/access-control.js');
var Router = require('./sc_module/Router.js');
var Auth = require('./sc_module/authentication.js');

module.exports.run = function(worker) {
    console.log(" >> Worker PID:", process.pid);
    var httpServer = worker.httpServer;
    var scServer = worker.scServer;

    scServer.webServer = WebServer;
    AccessControl.attach(scServer);
    var app = express();
    var mysql = require('mysql');
    var pool = mysql.createPool({
        connectionLimit: 500,
        host: "192.168.10.25",
        user: "root",
        password: "123456",
        database: "example",
        debug: false
    });

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
    scServer.on('connection', function (socket) {
        Auth.attach(pool, socket);//身份验证的中间件
        //消息
        socket.on('message', function (json) {
             console.log('------ socket # message -------',json);
        });

        socket.on('raw', function (data) {
            console.log('------ socket # raw -------',data);
        });

        //断开
        socket.on('disconnect', function (data) {
            //scServer.webServer.emit('disconnect',socket, data);
            scServer.webServer['disconnect'](socket, data);
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
           // console.error(err);
        });
    });

    /***************************************************************************
     *
     * 通道事件
     *
    ****************************************************************************/
    //建立一个通道向订阅的客户端发送服务器时间
    //setInterval(function () {
    //    scServer.webServer['syncTime'](channel, Date.now(), process.pid, Object.keys(scServer.clients).length);
    //    channel.publish('time',{
    //        time:Date.now(),
    //        pid: process.pid,
    //        client:Object.keys(scServer.clients).length,
    //    });
    //}, 1000);
};