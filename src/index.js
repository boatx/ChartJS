import {PieceOfCake, PieChart} from './piechart';

var setup = (function() {
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
    var chart = new PieChart(elements, colors, canvas);
    chart.draw();
}());
