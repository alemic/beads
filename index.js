var async = require("async");

var Application = function(context) {
    this.context = context;
    this.middlewares = [];
}

Application.prototype.when = function(isDepSatisfied) {
    var _this = this;
    return {
        use: function(fn) {
            _this.middlewares.push({isDepSatisfied: isDepSatisfied, fn: fn})
        }
    }
}

Application.prototype.use = function(fn) {
    this.middlewares.push({depSatisfied: true, fn: fn});
}

Application.prototype.run = function(callback) {
    var context = this.context;
    var pending = this.middlewares.concat(); // clone array
    var loop = function(pending) {

        var todos = [];
        var next = [];

        var isDepSatisfied = function(middleware, callback) {
            if(middleware.depSatisfied) {
                callback(null, true);
            } else {
                middleware.isDepSatisfied(context, function(depSatisfied) {
                    callback(null, depSatisfied);
                });
            };
        }

        var tests = pending.map(function(middleware) {
            return function(callback) {
                isDepSatisfied(middleware, function(err, depSatified) {
                    if (depSatified) {
                        todos.push(function(callback) {
                            middleware.fn(context, callback);
                        });
                    } else {
                        next.push(middleware);
                    }
                    callback();
                });
            }
        });


        async.parallel(tests, function() {
            if(todos.length > 0) {
                async.series(todos.concat([function() {loop(next)}]));
            } else {
                callback(null, context);
            }
        });
    }
    loop(pending);
}

module.exports = Application;