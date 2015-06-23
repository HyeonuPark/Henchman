module.exports = function() {
    var self = this;

    var pannel = document.getElementById(self.props().id + '.msglist');

    self.boss.on('addMessage').then(function(order) {
        var span = document.createElement('span');
        span.innerText = '[' + new Date().getTime() + ']<' + order.name + '> ' + order.message;
        pannel.appendChild(span);
        pannel.appendChild(document.createElement('br'));
    });
};