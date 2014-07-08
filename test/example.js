var context = {};
var app = new (require("../index.js"))(context);

app.use(function *(next) {
    console.log("set mark1!");
    this.mark1 = true;
    yield next;
});

app.when(function *() {
    return this.mark1;
}).use(function *(next) {
    console.log("mark1 set, set mark2!");
    this.mark2 = true;
    yield next;
});

app.when(function *() {
    return this.mark2;
}).use(function *(next) {
    console.log("mark2 set!");
    yield next;
});

app.when(function *() {
    return this.mark1;
}).use(function *(next) {
    console.log("mark1 set!");
    yield next;
});

app.use(function *(next){
    var start = new Date;
    console.log("timer start");
    yield next;
    var t = new Date - start;
    console.log("timer end");
    console.log(t + "ms");
});

app.run(function(err, context) {
    console.log("Output Context: " + JSON.stringify(context));
});