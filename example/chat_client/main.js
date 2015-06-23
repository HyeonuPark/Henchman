var chat = require('./chat');
var Henchman = require('henchman');

window.onload = function() {
    var chatElement = Henchman.createElement(chat, {});
}