var chat = require('./chat');
var Pipe = require('msgpipe');
var Henchman = require('henchman');

window.onload = function() {
    var ws = new WebSocket('ws://www.example.com/foo');
    ws.onload = function() {
        var pipe = new Pipe();
        pipe.top.on().then(function(report) {
            ws.send(JSON.stringify(report));
        }).catch(cosole.log.bind(console));
        ws.onmessage = function(message) {
            var order = JSON.parse(message);
            pipe.top.send(order._topic, order, order);
        };

        var chatElement = Henchman(chat, null, pipe.bottom);
    };
};