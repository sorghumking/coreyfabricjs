// draw scenespace ruler on fabricjs canvas
import { CoreyWebCanvas } from './canvas.js';
import { drawRuler, clearRuler } from './ruler.js';
import { GLAD4Images, GLAD9Images } from './imagefiles.js';

$(document).ready(initCanvas);

var canvas = null;
var showRuler = false;

function initCanvas() {
    canvas = new CoreyWebCanvas('c');
    canvas.setBackgroundColor('black');
    canvas.renderAll(); // init canvas.vptCoords
    canvas.init(update);
    loadImages(canvas);
    update();
}

function loadImages(canvas) {
    addCoreImage(canvas, GLAD9Images);
}

function update() {
    if (showRuler) {
        drawRuler(canvas);
    }
}

var coreImage = null;
function addCoreImage(canvas, imgFiles) {
    let ypos = 100;
    for (let f of imgFiles.slice(0,1)) {
        coreImage = fabric.Image.fromURL(
            'img/' + f,
            (img) => { // image-loaded callback
                img.scale(0.1);
                img.hasControls = false; // hide scale/rotate handles when selected
                img.lockMovementY = true; // only allow movement on depth axis
                canvas.add(img);
                coreImage = img;
            },
            { // image options
                left: 100,
                top: ypos,
            }
        );
        ypos += 125;
    }
}

$('#ruler').on('click', toggleRuler);
function toggleRuler() {
    showRuler = !showRuler;
    if (!showRuler) {
        clearRuler(canvas); // destroy existing ruler ticks or they'll continue to appear
    } else {
        drawRuler(canvas);
    }
    canvas.requestRenderAll();
}


$('#crop').on('click', toggleCrop);

// Can use cropX to clip left side of image, but not right.
// fabric.Object.clipTo() looks more versatile.
var cropped = false;
function toggleCrop() {
    // const crop = cropped ? -100 : 100;
    // coreImage.cropX = coreImage.cropX + crop;
    cropped = !cropped;

    if (cropped) {
        let clipCircle = new fabric.Rect({top:coreImage.top, left:coreImage.left, width:coreImage.width, height: 1000});
        coreImage.clipPath = clipCircle;
    } else {
        coreImage.clipPath = null;
    }

    canvas.requestRenderAll();
}