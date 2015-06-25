var button = require('./button');
var textbox = require('./textbox');

module.exports = function() {
    var self = this;

    self.child('sendButton').on('buttonClick').then(function(report) {
        return self.child('textInput').send('getText', {}, report);
    }).then(function(report) {
        this.message = report.text;
        self.child('textInput').send('setText', {text : ''}, report);
    }).then(function(report) {
        self.boss.send('sendMessage', {text : this.message}, report);
    }).catch(console.log.bind(console));

    var id = self.props().id + '.input';
    return {
        sendButton : [
            button,
            {
                id : id
            }
        ],
        textInput : [
            textbox,
            {
                id : id
            }
        ]
    };
};