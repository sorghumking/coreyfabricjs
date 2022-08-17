var rulerTicks = [];
export function drawRuler(canvas) {
    for (var tick of rulerTicks) {
        canvas.remove(tick);
    }
    rulerTicks = [];
    const left = canvas.vptCoords.tl.x
    const right = canvas.vptCoords.tr.x
    const range = right - left;
    const target = getTick(range);
    const start = nearest(left, target);
    const rate = range / target;
    for (var cur = start; cur <= right;) {
        var tick = createTickRect(cur, canvas.vptCoords.bl.y, 30 / canvas.getZoom(), canvas.getZoom());
        rulerTicks.push(tick);
        cur += target;
    }
    for (var tick of rulerTicks) {
        canvas.add(tick);
    }
}

// find multiple of target closest to num
function nearest(num, target) {
    return Math.round(num / target) * target;
}

function getTick(range) {
    var target = 1000.0; // gotta start somewhere
    while (true) {
        if (range / target < 10) {
            // console.log("old target = ", target, " new = ", target/2);
            target /= 2;
            continue;
        } else if (range / target > 30) {
            // console.log("old target = ", target, " new = ", target*2);
            target *= 2;
            continue;
        }
        break;
    }
    // console.log("target = ", target, " r/t = ", range/target);
    return target;
}

function createTickRect(x, y, height, zoom) {
    return new fabric.Rect({
        left: x,
        top: y - height,
        width: 1 / zoom,
        height: height,
        fill: 'rgb(0,0,0)',
        selectable: false,
        strokeWidth: 0,
        strokeUniform: true
    });
}
