/*
    Copyright (C) 2012 BoatX

    This file is part of diagJS.

    diagJS is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    diagJS is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with diagJS.  If not, see <http://www.gnu.org/licenses/>.
*/

/*global document */
/*global window */
function degToRad(deg) {
    "use strict";
    return (Math.PI / 180) * deg;
}

function PeaceOfCake(radius, stAngle, endAngle, centX, centY, color) {
    "use strict";
    this.radius = radius;
    this.centX = centX;
    this.centY = centY;
    this.color = color;
    this.stAngle = stAngle;
    this.endAngle = endAngle;

    this.draw = function (canvas) {
        if (canvas.getContext) {
            var c = canvas.getContext('2d');
            c.beginPath();
            c.arc(this.centX, this.centY, this.radius, this.stAngle, this.endAngle);
            c.lineTo(this.centX, this.centY);
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
            this.canvas = canvas;
        }
    };

    this.arcCenterVec = function () {
        var middeg = (endAngle - stAngle) / 2.0;
        return [Math.cos(middeg), Math.sin(middeg)];
    };

    this.clear = function () {
        if (this.canvas) {
            return true;
        }
    };
}

function CircDiag(elementArray, colorArray, canvas) {
    this.elementArray = elementArray;
    this.colorArray = colorArray;
    this.peacesArray = [];
    this.centX = 400;
    this.centY = 400;
    this.radius = 200;
    this.aniSpeed = 0.01;
    this.canvas = canvas;
    var ob = this;

    this.draw = function () {
        if (canvas.getContext) {
            var c = canvas.getContext('2d'), stAng = 0, endAng = 0, i;
            for (i in this.elementArray) {
                if (this.elementArray.hasOwnProperty(i)) {
                    endAng = stAng + degToRad(360 * this.elementArray[i]);
                    this.peacesArray[i] = new PeaceOfCake(this.radius, stAng, endAng, this.centX, this.centY, this.colorArray[i]);
                    this.peacesArray[i].draw(canvas);
                    stAng = endAng;
                }
            }
        }
    };

    this.animate = function () {
        var reqAnimFrame = window.mozRequestAnimationFrame    ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame     ||
                        window.oRequestAnimationFrame;
        if (ob.peacesArray[ob.activePeace].radius < 250) {
            reqAnimFrame(ob.animate);
            ob.peacesArray[ob.activePeace].radius += ob.aniSpeed * ob.radius;
            ob.aniSpeed += 0.01;
            ob.redraw();
        } else {
            ob.aniSpeed = 0.01;
        }
    };

    this.redraw = function () {
        if (this.canvas.getContext) {
            var c = this.canvas.getContext('2d'),
                stAng = 0,
                endAng = 0,
                i;

            c.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (i in this.elementArray) {
                if (this.elementArray.hasOwnProperty(i)) {

                    endAng = stAng + degToRad(360 * this.elementArray[i]);
                    this.peacesArray[i].draw(this.canvas);
                    stAng = endAng;
                }
            }
        }
    };

    this.init = function () {
        ob.canvas.onclick = function (e) {
            var x = e.pageX - canvas.offsetLeft,
                y = e.pageY - canvas.offsetTop,
                chk = (x - ob.centX) * (x - ob.centX) + (y - ob.centY) * (y - ob.centY),
                v1dl,
                deg,
                i;
            if (chk <= ob.radius * ob.radius) {
                x = x - ob.centX;
                y = y - ob.centY;
                v1dl = Math.sqrt(x * x + y * y);
                deg = Math.acos(x / v1dl);
                if (y < 0) {
                    deg = degToRad(360) - deg;
                }
                for (i in ob.peacesArray) {
                    if (ob.peacesArray.hasOwnProperty(i)) {
                        if (deg >= ob.peacesArray[i].stAngle && deg <= ob.peacesArray[i].endAngle) {
                            if (ob.activePeace !== i) {
                                if (ob.activePeace) {
                                    ob.peacesArray[ob.activePeace].radius = ob.radius;
                                }
                                ob.activePeace = i;
                                ob.animate();
                            }

                        }
                    }
                }
            } else {
                if (ob.activePeace) {
                    ob.peacesArray[ob.activePeace].radius = ob.radius;
                    ob.redraw();
                    delete ob.activePeace;
                }
            }
        };

        ob.canvas.addEventListener('mousemove', ob.canvas.onclick, false);
    };
    this.init();

}
