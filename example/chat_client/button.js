module.exports = function() {
    var self = this;

    var button = document.getElementById(self.props().id + '.button');
    button.addEventListener('click', function() {
        self.parent.send('buttonClick', null, null, -1);
    });

    return {};
};