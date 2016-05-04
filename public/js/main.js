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

$(document).ready(function () {
    server.connect();
});