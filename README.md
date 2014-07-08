# Beads

Koa like General purpose middleware layer for nodejs.

Dependency Test -> Functions whose dependency was satisfied -> RUN those functions one by one -> Dependency Test

## Features

- Resolve dependency

- Shared context among middlewares

## Example

```
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
```

The output:
```
set mark1!
timer start
mark1 set, set mark2!
mark1 set!
mark2 set!
Output Context: {"mark1":true,"mark2":true}
timer end
2ms
```

## FAQ

- 这目标于一种情况

    每次依赖条件已解决，执行一批插件。
    插件 A, B 依赖于条件1，插件 C, D 依赖于条件2。
    B中会解决条件2。
    那么A, B的顺序不确定，但是A, B都先于C, D执行。

    如果不是成批执行，
    若定义顺序为 B C D A 则实际运行顺序为
    B C D A，A的条件本早已满足，却在最后被执行了。
    
    为此依赖必须单独与函数体存在。
    否则在执行函数前无法知道依赖是否满足，
    但是执行函数可能改变依赖条件，
    这样就无法实现无损的依赖判断。

- SyntaxError: Unexpected identifier

    You can't use yield inside a regular function!

    http://stackoverflow.com/questions/20834113/syntaxerror-unexpected-identifier-generators-in-es6
