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
    server.connect();
});

server.on('message', function (data) {
    if($('#checkBox').is(':checked')){
        console.log('[Main]------ message -------',data);
    }
});