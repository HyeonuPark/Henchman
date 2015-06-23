module.exports = function() {
    var self = this;

    var socket = new WebSocket(self.props().address);
    socket.onmessage = function(message) {
        self.boss.send('message', {message : message});
    };

    self.boss.on('send').then(function(order) {
        socket.send(order.message);
        self.boss.send('sendDone', {}, order);
    });
}