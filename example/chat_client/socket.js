module.exports = function() {
    var self = this;

    var socket = new WebSocket(self.props().address);
    socket.onmessage = function(message) {
        self.parent.send('message', {message : message}, null, -1);
    };

    self.parent.on('send').then(function(order) {
        socket.send(order.message);
        self.parent.send('sendDone', null, order, -1);
    });
}