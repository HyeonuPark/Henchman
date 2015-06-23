module.exports = function() {
    var self = this;

    var input = document.getElementById(this.props().id +'.textbox');
    input.addEventListener('change', function onChange() {
        self.boss.send('textChange', {text : input.value});
    });

    self.boss.on('setText').then(function(order) {
        input.value = order.text;
        self.boss.send('setTextDone', {}, order);
    });

    self.boss.on('getText').then(function(order) {
        self.boss.send('text', {text : input.value}, order);
    });

    return {};
};