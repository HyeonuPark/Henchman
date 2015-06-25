module.exports = function() {
    var self = this;

    var pannel = document.getElementById(self.props().id + '.msglist');

    self.parent.on('addMessage').then(function(report) {
        var span = document.createElement('span');
        span.innerText = '[' + new Date().getTime() + ']<' + order.name + '> ' + order.message;
        pannel.appendChild(span);
        pannel.appendChild(document.createElement('br'));
        return self.parent.send('addMessageDone', null, report, -1);
    }).catch(console.log.bind(console));
};