var argv = require('minimist')(process.argv.slice(2));
var SocketCluster = require("socketcluster").SocketCluster;
var cpus = require('os').cpus();

var socketCluster = new SocketCluster({
    brokers: Number(argv.b) || cpus.length /8,
    workers: Number(argv.w) || cpus.length,
    port: Number(argv.p) || 80,
    appName: argv.n || 'example',
    logLevel:1,
    path:'/SocketCluster',
    workerController: __dirname + '/worker.js',
    brokerController: __dirname + '/broker.js',
    crashWorkerOnError: argv['auto-reboot'] != false,
    socketChannelLimit: 1000,
    rebootWorkerOnCrash: false
});

socketCluster.on('ready', function () {
    console.log('SocketCluster startup success');
    console.log("Open your browser to access http://localhost:%s",socketCluster.options.port);
    console.log("Client connection ws://localhost:%s%s",socketCluster.options.port,socketCluster.options.path);
});

socketCluster.on('fail', function (data) {
    console.log('socketCluster # fail',data);
});

socketCluster.on('worker', function (data) {
    console.log('socketCluster # worker',data);
});

socketCluster.on('workerMessage', function (data) {
    console.log('socketCluster # workerMessage',data);
});

socketCluster.on('brokerMessage', function (data) {
    console.log('socketCluster # brokerMessage',data);
});
