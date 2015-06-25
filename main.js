var Pipe = require('msgpipe');

function Henchman(component, properties, parent) {

    var pipes = {};

    var element = {
        _component : component,
        _children : {},
        _parent : parent,
        _child : function getChild(name) {
            if (!pipes[name]) pipes[name] = new Pipe();
            return pipes[name].top;
        },
        _props : function getProperties() {
            return properties;
        }
    };

    var children = component.call(element);

    for (var childName in children) {
        if (!pipes[childName]) pipes[childName] = new Pipe();
        if (typeof children[childName][0] === 'function')
            element.children[childName] = Henchman(children[childName][0], children[childName][1], pipes[childName].bottom);
        else if (children[childName][0] === 'list')
            element.children[childName] = Henchman.list(children[childName][1], pipes[childName].bottom);
    }

    return element;
}

Henchman.list = function(component, parent) {
    var children = {};
    var pipes = {};

    parent.on().then(function(e) {
        if (e._event[0] === '_') {
            return parent.send('_proxyError', {reason:'StartWithEscapeKeyword'}, e, -1);
        }
        if (!e._target) {
            return parent.send('_proxyError', {reason:'TargetNotSpecified'}, e, -1);
        }
        return pipes[e._target].send(e._event, e, e, -1);
    });

    parent.on('_add').then(function(e) {
        var pipe = new Pipe();
        pipes[e.name] = pipe.top;
        children[e.name] = Henchman(component, e.props, pipe.bottom);
        pipes[e.name].on().then(function(eChild) {
            eChild._source = e.name;
            return parent.send(eChild._event, eChild, eChild, -1);
        });
        return parent.send('_addDone', null, e, -1);
    });

    parent.on('_remove').then(function(e) {
        if (!pipes[e.name]) {
            delete children[e.name];
            parent.send('_removeError', {reason:'NotExist'}, e, -1);
            throw new Error('Removing child is requested for unexisted name');
        }
        this.name = e.name;
        return pipes[e.name].send('_kill', null, e);
    }).then(function(e) {
        if (e._event === '_killError') {
            parent.send('_removeError', {reason:'Failed'}, e, -1);
            throw new Error('Removing child failed');
        }
        delete pipes[this.name];
        delete children[this.name];
        return parent.send('_removeDone', null, e, -1);
    }).catch(function(e) {
        console.log('Error - ' + e.message);
        console.log(e.stack);
    });

    return children;
};