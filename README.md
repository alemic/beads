# Beads

General purpose middleware layer for nodejs.

## Features

- Shared context between middlewares

- Resolve & Reject support

## Example

```
var app = new (require("../index.js"));
app.use(function(context, resolve, reject) {
    console.log("set mark1!");
    context.mark1 = true;
    resolve();
});
app.use(function(context, resolve, reject) {
    if(context.mark1 && context.mark2) {
        console.log("mark set!")
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
app.run({}, function(err, context) {
    console.log("Output Context: " + JSON.stringify(context));
});
```

The output:
```
set mark1!
set mark2!
mark set!
Output Context: {"mark1":true,"mark2":true}
```
