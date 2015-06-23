var Pipe = require('./pipe');

var Henchman = {};

Henchman.createElement = function createElement(component, properties, boss) {
    var elementHenchmenPipe = {};

    var element = {
        boss : boss,
        henchman : function getHenchman(name){
            if (!elementHenchmenPipe[name]) {
                elementHenchmenPipe[name] = new Pipe();
            }
            return elementHenchmenPipe[name].top;
        },
        props : function getProperties(){return properties},
        state : {},
        _children : {}
    };

    var children = component.call(element);
    for (var childName in children) {
        element._children[childName] = Henchman.createElement(children[childName]._component, children[childName], elementHenchmenPipe[childName].bottom);
    }
    return element;
};