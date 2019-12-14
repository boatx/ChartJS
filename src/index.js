import { PieChart } from './piechart';

const setup = () => {
  const elements = {
    dogs: 0.3,
    cats: 0.6,
    dinosaurs: 0.1,
  };

  const colors = {
    dogs: 'green',
    cats: 'blue',
    dinosaurs: 'red',
  };

  const canvas = document.getElementById('can');
  const chart = new PieChart(elements, colors, canvas);
  chart.draw();
};

setup();
