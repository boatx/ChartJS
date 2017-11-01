# DiagJS

Pie charts JavaScript library, use only canvas.

## Usage

```javascript

    var elements = {
        dogs: 0.3,
        cats: 0.6,
        dinosaurs: 0.1
    };

    var colors = {
        dogs: 'green',
        cats: 'blue',
        dinosaurs: 'red'
    };

    var canvas = document.getElementById('can');
    var diag = diagJS.CircDiag(elements, colors, canvas);
    diag.draw();

```

