var co = require("co"),
    assert = require("assert"),
    thunkify = require("thunkify"),
    request = require("request"),
    fs = require("fs");

var Application = function(context) {
    this.context = context;
    this.middlewares = [];
}

Application.prototype.when = function(isDepSatisfied) {
    var _this = this;
    assert(isDepSatisfied.constructor.name == "GeneratorFunction", "app.when: wrong type argument, generator function needed");
    return {
        use: function(fn) {
            assert(fn.constructor.name == "GeneratorFunction", "app.use: wrong type argument, generator function needed");
            _this.middlewares.push({isDepSatisfied: isDepSatisfied, fn: fn})
        }
    }
}

Application.prototype.use = function(fn) {
    var _this = this;
    this.when(function *() {
        return true;
    }).use(fn);
}

Application.prototype.run = function(callback) {
    var context = this.context;
    var pending = this.middlewares.concat(); // clone array

    co(function *() {
        var loop = function *(pending) {
            var todos = [],
                next = [],
                tests = pending.map(function(middleware) {
                    return middleware.isDepSatisfied;
                    // return function *() {
                    //    return middleware.isDepSatisfied.call(context);
                    // }
                });
            (yield tests).forEach(function(satisfied, index) {
                if(satisfied) {
                    todos.push(pending[index].fn);
                } else {
                    next.push(pending[index]);
                }
            });
            if(todos.length > 0) {
                // exec one by one
                var iter = function *() {
                    if(todos.length > 0) {
                        yield (todos.shift()).call(context, iter);
                    } else {
                        yield loop.call(context, next);
                    }
                }
                yield iter()
            } else {
                callback(null, context);
            }
        }
        yield loop.call(context, pending);
    }).call(context);
}

module.exports = Application;