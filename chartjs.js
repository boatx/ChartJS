/*global document */
/*global window */

var chartJS = (function () {

    function degToRad(deg) {
        "use strict";
        return (Math.PI / 180) * deg;
    }

    function radToDeg(rad) {
        "use strict";
        return rad * (180 / Math.PI);
    }

    function degToLen(deg, x, y, r) {
        "use strict";
        return {
            x: x + r * Math.cos(deg),
            y: y + r * Math.sin(deg)
        };
    }

    function dist(x1, y1, x2, y2) {
        "use strict";
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }


    function PieceOfCake(radius, stAngle, endAngle, centX, centY, color) {
        "use strict";
        this.radius = radius;
        this.centX = centX;
        this.centY = centY;
        this.color = color;
        this.stAngle = stAngle;
        this.endAngle = endAngle;

        this.draw = function (canvas) {
            if (!canvas.getContext) {
                return
            }
            var context = canvas.getContext('2d');
            context.beginPath();
            context.arc(this.centX, this.centY, this.radius, this.stAngle, this.endAngle);
            context.lineTo(this.centX, this.centY);
            context.fillStyle = this.color;
            context.fill();
            context.closePath();
            this.canvas = canvas;
        };

        this.arcCenterVec = function () {
            var middeg = (endAngle - stAngle) / 2.0;
            return [Math.cos(middeg), Math.sin(middeg)];
        };
    }

    function PieChart(elements, colors, canvas) {
        this.elements = elements;
        this.colors = colors;
        this.pieces = [];
        this.centX = 400;
        this.centY = 400;
        this.radius = 200;
        this.aniSpeed = 0.01;
        this.canvas = canvas;
        var ob = this;

        this.draw = function () {
            if (!canvas.getContext) {
                return
            }
            var context = canvas.getContext('2d'), startAngle = 0, endAng = 0, element;
            for (element in this.elements) {
                if (this.elements.hasOwnProperty(element)) {
                    endAng = startAngle + degToRad(360 * this.elements[element]);
                    this.pieces[element] = new PieceOfCake(
                        this.radius, startAngle, endAng, this.centX, this.centY, this.colors[element]
                    );
                    this.pieces[element].draw(canvas);
                    startAngle = endAng;
                }
            }
            this.addLabels();
        };

        this.redraw = function () {
            if (!this.canvas.getContext) {
                return;
            }
            var context = this.canvas.getContext('2d'),
                element;
            context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            for (element in this.elements) {
                if (this.elements.hasOwnProperty(element)) {
                    this.pieces[element].draw(this.canvas);
                }
            }
            this.addLabels();
        };

        this.getLabelPosition = function(chartElement) {
            var bisection = (chartElement.stAngle + chartElement.endAngle) / 2.0;
            var labelRadiusOffset = 0.1*this.radius;
            var radius = chartElement.radius + labelRadiusOffset;
            return degToLen(bisection, chartElement.centX, chartElement.centY, radius);
        };


        this.addLabels = function () {
            if (!canvas.getContext) {
                return;
            }
            var context = canvas.getContext('2d');
            context.font = "bold 12px sans-serif";
            for (var element in this.elements) {
                if (this.elements.hasOwnProperty(element) && this.pieces[element]) {
                    chartElement = this.pieces[element]
                    var labelPosition = this.getLabelPosition(chartElement);
                    context.fillText(element, labelPosition.x, labelPosition.y);
                }
            }

        };

        this.animate = function () {
            var reqAnimFrame = window.requestAnimationFrame    ||
                            window.webkitRequestAnimationFrame ||
                            window.msRequestAnimationFrame     ||
                            window.oRequestAnimationFrame;
            var activePiece = ob.pieces[ob.activePiece];
            if (activePiece.radius < 250) {
                reqAnimFrame(ob.animate);
                activePiece.radius += ob.aniSpeed * ob.radius;
                ob.aniSpeed += 0.01;
                ob.redraw();
            } else {
                ob.aniSpeed = 0.01;
            }
        };


        this.init = function () {
            ob.canvas.onclick = function (event) {
                var x = event.pageX - canvas.offsetLeft,
                    y = event.pageY - canvas.offsetTop,
                    chk = (x - ob.centX) * (x - ob.centX) + (y - ob.centY) * (y - ob.centY),
                    v1dl,
                    deg;
                if (chk <= ob.radius * ob.radius) {
                    x = x - ob.centX;
                    y = y - ob.centY;
                    v1dl = Math.sqrt(x * x + y * y);
                    deg = Math.acos(x / v1dl);
                    if (y < 0) {
                        deg = degToRad(360) - deg;
                    }
                    for (var piece in ob.pieces) {
                        if (ob.pieces.hasOwnProperty(piece)) {
                            if (deg >= ob.pieces[piece].stAngle && deg <= ob.pieces[piece].endAngle) {
                                if (ob.activePiece !== piece) {
                                    if (ob.activePiece) {
                                        ob.pieces[ob.activePiece].radius = ob.radius;
                                    }
                                    ob.activePiece = piece;
                                    ob.animate();
                                }

                            }
                        }
                    }
                } else {
                    if (ob.activePiece) {
                        ob.pieces[ob.activePiece].radius = ob.radius;
                        ob.redraw();
                        delete ob.activePiece;
                    }
                }
            };

            ob.canvas.addEventListener('mousemove', ob.canvas.onclick, false);
        };
        this.init();
    }

    return {
        PieChart: function (elements, colors, canvas) {
            return new PieChart(elements, colors, canvas);
        }
    };
}());
