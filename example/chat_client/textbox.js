module.exports = function() {
    var self = this;

    var input = document.getElementById(this.props().id +'.textbox');
    input.addEventListener('change', function onChange() {
        self.parent.send('textChange', {text : input.value}, null, -1);
    });

    self.parent.on('setText').then(function(order) {
        input.value = order.text;
        self.parent.send('setTextDone', null, order, -1);
    }).catch(console.log.bind(console));

    self.parent.on('getText').then(function(order) {
        self.parent.send('text', {text : input.value}, order, -1);
    }).catch(console.log.bind(console));

    return {};
};