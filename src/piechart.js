import {degToRad, radToDeg, degToLen, Point} from './utils';

export class PieceOfCake {

    constructor(radius, stAngle, endAngle, center, color) {
        this.radius = radius;
        this.center = center;
        this.color = color;
        this.stAngle = stAngle;
        this.endAngle = endAngle;
    }

    draw(canvas) {
        const x = this.center.x;
        const y = this.center.y;
        const context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, this.radius, this.stAngle, this.endAngle);
        context.lineTo(x, y);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    };
}

export class PieChart {

    constructor(elements, colors, canvas) {
        this.elements = elements;
        this.colors = colors;
        this.pieces = [];
        this.radius = 200;
        this.aniSpeed = 0.01;
        this.canvas = canvas;
        this.center = new Point(400, 400);

        this.init();
    }

    draw() {
        const context = this.canvas.getContext('2d')
        let startAngle = 0, endAng = 0;
        for (let element in this.elements) {
            endAng = startAngle + degToRad(360 * this.elements[element]);
            const pieceOfCake = new PieceOfCake(
                this.radius, startAngle, endAng, this.center, this.colors[element]
            );
            this.pieces[element] = pieceOfCake;
            pieceOfCake.draw(this.canvas);
            startAngle = endAng;
        }
        this.addLabels();
    };

    redraw() {
        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let element in this.elements) {
            this.pieces[element].draw(this.canvas);
        }
        this.addLabels();
    };

    getLabelPosition(chartElement) {
        var bisection = (chartElement.stAngle + chartElement.endAngle) / 2.0;
        var labelRadiusOffset = 0.1*this.radius;
        var radius = chartElement.radius + labelRadiusOffset;
        return degToLen(bisection, chartElement.center, radius);
    };

    addLabels() {
        const context = this.canvas.getContext('2d');
        context.font = "bold 12px sans-serif";
        for (let element in this.elements) {
            if (this.pieces[element]) {
                const chartElement = this.pieces[element]
                const labelPosition = this.getLabelPosition(chartElement);
                context.fillText(element, labelPosition.x, labelPosition.y);
            }
        }
    };

    animate() {
        const reqAnimFrame = window.requestAnimationFrame  ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame     ||
                        window.oRequestAnimationFrame;
        const activePiece = this.pieces[this.activePiece];
        if (activePiece.radius < 250) {
            reqAnimFrame(() => this.animate());
            activePiece.radius += this.aniSpeed * this.radius;
            this.aniSpeed += 0.01;
            this.redraw();
        } else {
            this.aniSpeed = 0.01;
        }
    };

    init() {
        const handler = (event) => {
            let x = event.pageX - this.canvas.offsetLeft;
            let y = event.pageY - this.canvas.offsetTop;
            const point = new Point(x, y);
            if (point.dist(this.center) <= this.radius) {
                x = x - this.center.x;
                y = y - this.center.y;
                const v1dl = Math.sqrt(x * x + y * y);
                let deg = Math.acos(x / v1dl);
                if (y < 0) {
                    deg = degToRad(360) - deg;
                }
                for (let piece in this.pieces) {
                    const chartPiece = this.pieces[piece]
                    if (deg >= chartPiece.stAngle && deg <= chartPiece.endAngle && this.activePiece !== piece) {
                        if (this.activePiece) {
                            this.pieces[this.activePiece].radius = this.radius;
                        }
                        this.activePiece = piece;
                        this.animate();
                    }
                }
                return
            } else {
                if (this.activePiece) {
                    this.pieces[this.activePiece].radius = this.radius;
                    this.redraw();
                    delete this.activePiece;
                }
            }
        };

        this.canvas.addEventListener('mousemove', handler, false);
    };
}
