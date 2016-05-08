var server = WebServerUtils();
var Alert = {};
Alert.show = function (text) {
  alert(text);
};

console.log = function () {
    var arr = Array.prototype.slice.call(arguments);
    addMessage(arr.join(' '));
};

function addMessage(text){
    var li = document.createElement("li");
    li.innerText = text;
    $('#msgList > ul').append(li);
}

$('#clearBtn').on('click', function () {
    $('#msgList > ul').empty();
});

$(document).ready(function () {
    var options = {
        protocol: 'http',
        hostname: '192.168.10.31',
        port: 80,
        path:"/SocketCluster"
    };

    server.connect(options);
});

server.on('time', function (data) {
    var date = new Date();
    date.setTime = data.time;
    $('#time').html(date.toLocaleDateString() + date.toLocaleTimeString());
    $('#pid').html("client="+data.client);
});

server.on('message', function (data) {
    if($('#checkBox').is(':checked')){
        console.log('[Main]------ message -------',data);
    }
});

server.on('success', function (json) {
    console.log("success ========",JSON.stringify(json));
});