# Beads

General purpose middleware layer for nodejs.

Dependency Test -> Functions whose dependency was satisfied -> RUN those functions one by one -> Dependency Test

## Features

- Resolve dependency

- Shared context among middlewares

## Example

```
var context = {};
var app = new (require("../index.js"))(context);

app.use(function(context, next) {
    console.log("set mark1!");
    context.mark1 = true;
    next();
});

app.when(function(context, setDepSatisfied) {
    setDepSatisfied(context.mark1 && context.mark2);
}).use(function(context, next) {
    console.log("mark 1 & mark 2 set!, set mark3 now.");
    context.mark3 = true;
    next();
});

app.when(function(context, setDepSatisfied) {
    setDepSatisfied(context.mark1);
}).use(function(context, next) {
    console.log("mark 1 set! set mark2!");
    context.mark2 = true;
    next();
});

app.when(function(context, setDepSatisfied) {
    setDepSatisfied(context.mark1);
}).use(function(context, next) {
    console.log("mark 1 set!");
    next();
});

app.run(function(err, context) {
    console.log("Output Context: " + JSON.stringify(context));
});
```

The output:
```
set mark1!
mark 1 set! set mark2!
mark 1 set!
mark 1 & mark 2 set!, set mark3 now.
Output Context: {"mark1":true,"mark2":true,"mark3":true}
```
