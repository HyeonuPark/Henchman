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

    parent.on().then(function(order) {
        if (order._topic[0] === '_') {
            return parent.send('_proxyError', {reason:'TopicStartWithEscapeKeyword'}, order, -1);
        }
        if (!order._target) {
            return parent.send('_proxyError', {reason:'TargetNotSpecified'}, order, -1);
        }
        return pipes[order._target].send(order._topic, order, order, -1);
    }).catch(console.log.bind(console));

    parent.on('_add').then(function(order) {
        var pipe = new Pipe();
        pipes[order.name] = pipe.top;
        children[order.name] = Henchman(component, order.props, pipe.bottom);
        pipes[order.name].on().then(function(report) {
            if (report._topic[0] === '_') {
                return pipes[order.name].send('_proxyError', {reason:'TopicStartWithEscapeKeyword'}, report, -1);
            }
            report._source = order.name;
            return parent.send(report._topic, report, report, -1);
        });
        return parent.send('_addDone', null, order, -1);
    }).catch(console.log.bind(console));

    parent.on('_remove').then(function(order) {
        if (!pipes[order.name]) {
            delete children[order.name];
            parent.send('_removeError', {reason:'NotExist'}, order, -1);
            throw new Error('Removing child is requested for unexisted name');
        }
        this.name = order.name;
        return pipes[order.name].send('_kill', null, order);
    }).then(function(report) {
        if (report._topic === '_killError') {
            parent.send('_removeError', {reason:'Failed'}, report, -1);
            throw new Error('Removing child failed');
        }
        delete pipes[this.name];
        delete children[this.name];
        return parent.send('_removeDone', null, report, -1);
    }).catch(function(err) {
        console.log('Error - ' + err.message);
        console.log(err.stack);
    });

    return children;
};