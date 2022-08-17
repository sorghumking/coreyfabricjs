// draw scenespace ruler on fabricjs canvas
import { CoreyWebCanvas } from './canvas.js';
import { drawRuler } from './ruler.js';

$(document).ready(initCanvas);

var canvas = null;

function initCanvas() {
    canvas = new CoreyWebCanvas('c');
    canvas.renderAll(); // init canvas.vptCoords
    canvas.init(update);
    update();
}

function update() {
    drawRuler(canvas);
}
