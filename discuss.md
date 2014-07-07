# 被拒绝的模式

## resolve & reject

这个模式有个问题，那就是运行前不知道是否依赖满足。
无法实现对某一个依赖满足之后，执行一批callback。
这样就很难实现对顺序的完全剥离。
对此，依赖函数必须独立出来。

```
var app = new (require("../index.js"));
app.use(function(context, resolve, reject) {
    console.log("set mark1!");
    context.mark1 = true;
    resolve();
});
app.use(function(context, resolve, reject) {
    if(context.mark1 && context.mark2) {
        console.log("mark 1 & mark 2 set!")
        resolve();
    } else {
        reject(); // dependiency not satified, try again later
    }
});
app.use(function(context, resolve, reject) {
    console.log("set mark2!");
    context.mark2 = true;
    resolve();
});
app.use(function(context, resolve, reject) {
    console.log("set mark3!");
    context.mark3 = true;
    resolve();
});
app.run({}, function(err, context) {
    console.log("Output Context: " + JSON.stringify(context));
});
```
