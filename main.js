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
    loadLithRect(canvas);
    update();
}

function loadLithRect(canvas) {
    let rect = new fabric.Rect({
        width: 100,
        height: 100,
        selectable: true,
        hasControls: false,
        backgroundColor: 'green',
        borderColor: 'red',
        borderWidth: 2,
        lockMovementX: true,
        lockMovementY: true
    });

    let rect2 = new fabric.Rect({
        left: 100,
        width: 100,
        height: 100,
        selectable: true,
        // hasControls: false,
        backgroundColor: 'orange',
        borderColor: 'red',
        borderWidth: 2,
        // lockMovementX: true,
        lockMovementY: true
    });

    canvas.add(rect);
    canvas.add(rect2);

    fabric.util.loadImage('img/lithologies/601.png', (img) => {
        rect.set('fill', new fabric.Pattern({
            source: img,
            repeat: 'repeat',
        }));
        rect2.set('fill', new fabric.Pattern({
            source: img,
            repeat: 'repeat',
        }));
    });
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
// Adjust width to "crop" right side of image.

var cropped = false;
function toggleCrop() {
    const scaling = coreImage.getObjectScaling();
    console.log(scaling);

    const crop = cropped ? -1000 : 1000;
    coreImage.cropX = coreImage.cropX + crop; // crop left
    coreImage.left = coreImage.left + crop * scaling.scaleX; // negate left shift due to left crop
    coreImage.width = coreImage.width - crop * 2; // crop right (must double to account for cropped left)
    cropped = !cropped;

    // Clipping the Image's clipPath with a fabric.Rect clips correctly, but causes the image to become blurry.
    // This seems to be an unresolved issue in FabricJS.
    // if (cropped) {
    //     const botClip = 250;
    //     let clipRect = new fabric.Rect({top:-coreImage.height/2, left:-coreImage.width/2, width:coreImage.width - botClip, height: coreImage.height});
    //     coreImage.clipPath = clipRect;
    // } else {
    //     coreImage.clipPath = null;
    // }

    canvas.requestRenderAll();
}