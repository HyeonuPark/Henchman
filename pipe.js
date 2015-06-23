var EventEmitter = typeof process !== 'undefined' ? process.EventEmitter : require('wolfy87-eventemitter');

module.exports = function Pipe() {
    var pipe = this;
    pipe.top = new EventEmitter();
    pipe.top.send = function send(event, data) {
        pipe.bottom.emit(event, data);
    };
    pipe.bottom = new EventEmitter();
    pipe.bottom.send = function send(event, data) {
        pipe.top.emit(event, data);
    };
};