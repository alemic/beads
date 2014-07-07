var Application = function() {
    this.middlewares = [];
}

Application.prototype.use = function(middleware) {
    this.middlewares.push(middleware);
}

Application.prototype.run = function(context, callback) {
    var pending = this.middlewares.concat(); // clone array
    var loop = function(pending) {
        var resolve = function() {
            pending.shift();
            loop(pending);
        }
        var reject = function() {
            pending.push(pending.shift());
            loop(pending);
        }
        if (pending.length > 0 ) {
            pending[0](context, resolve, reject);
        } else {
            var err = null;
            callback(err, context);
        }
    }
    loop(pending);
}

module.exports = Application;