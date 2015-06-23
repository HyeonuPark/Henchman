module.exports = function() {
    var self = this;

    var button = document.getElementById(self.props().id + '.button');
    button.addEventListener('click', function() {
        self.boss.send('buttonClick', {});
    });

    return {};
};