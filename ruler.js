var rulerTicks = [];
var rulerLabels = [];
export function drawRuler(canvas) {
    for (var tick of rulerTicks) { canvas.remove(tick); }
    for (var label of rulerLabels ) { canvas.remove(label); }
    rulerTicks = [];
    const left = canvas.vptCoords.tl.x
    const right = canvas.vptCoords.tr.x
    const range = right - left;
    const target = getTick(range, canvas);
    const start = nearest(left, target);
    // console.log("left = " + left + "; right = " + right + "; range = " + range + "; target = " + target + "; start = " + start);
    const rate = range / target;
    for (var cur = start; cur <= right;) {
        var tick = createTickRect(cur, canvas.vptCoords.bl.y, 30 / canvas.getZoom(), canvas.getZoom());
        canvas.add(tick);
        rulerTicks.push(tick);
        var label = createTickLabel(cur.toString(), cur, canvas.vptCoords.bl.y - 50 / canvas.getZoom(), canvas.getZoom());
        canvas.add(label);
        rulerLabels.push(label);
        cur += target;
    }
}

export function clearRuler(canvas) {
    for (var tick of rulerTicks) { canvas.remove(tick); }
    for (var label of rulerLabels ) { canvas.remove(label); }
}

// find multiple of target closest to num
function nearest(num, target) {
    return Math.round(num / target) * target;
}

// return tick spacing in canvas-space e.g. 100.0 means draw ticks at 100, 200, 300...
function getTick(range, canvas) {
    const INTER_TICK_MIN = 30.0; // min pixels between ticks
    const INTER_TICK_MAX = 500.0; // max pixels between ticks
    var target = 1000.0;
    while (true) {
        const pixBetweenTicks = canvas.getZoom() * target;
        if (pixBetweenTicks < INTER_TICK_MIN) {
            target *= 10;
            continue;
        } else if (pixBetweenTicks > INTER_TICK_MAX) {
            target /= 10;
            continue;
        }
        break;
    }
    // console.log("target = ", target, " r/t = ", range/target);
    //console.log("tick spacing = ", (canvas.getZoom())*target);
    return target;
}

function createTickRect(x, y, height, zoom) {
    return new fabric.Rect({
        left: x,
        top: y - height,
        width: 1 / zoom,
        height: height,
        fill: 'white',
        selectable: false,
        strokeWidth: 0,
        strokeUniform: true
    });
}

function createTickLabel(text, x, y, zoom) {
    return new fabric.Text(
        text,
        {
            left: x,
            top: y,
            fontFamily: 'sans-serif',
            fontSize: 20 / zoom,
            fill: 'white',
            selectable: false,
            strokeWidth: 0
        }
    );
}
