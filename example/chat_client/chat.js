var input = require('./input');
var msglist = require('./msglist');
var socket = require('./socket');

module.exports = function() {
    var self = this;

    var nick = '';
    var alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i=0;i<3;i++) {
        nick += alphabets[Math.floor(Math.random() * alphabets.length)];
    }

    self.parent.on('message').then(function(report) {
        var chatMessage = JSON.stringify(report.message);
        self.child('chatlist').send('addMessage', {name : chatMessage.name, message : chatMessage.message}, report, -1);
    }).catch(console.log.bind(console));

    self.child('input').on('sendMessage').then(function(report) {
        this.text = report.text;
        return self.parent.send('send', {message:JSON.stringify({name : nick, message : this.text})});
    }).then(function(report) {
        self.child('chatlist').send('addMessage', {name : nick, message : this.text});
    }).catch(console.log.bind(console));

    return {
        input : [
            input,
            {
                id : 'chat'
            }
        ],
        chatlist : [
            msglist,
            {
                id : 'chat'
            }
        ]
    };
}