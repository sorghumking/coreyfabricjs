// Pan & zoom logic from fabricjs tutorial http://fabricjs.com/fabric-intro-part-5
export function initPanAndZoom(canvas, updateFn) {
    canvas.on('mouse:wheel', function (opt) {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        canvas.setZoom(zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
        updateFn();
    });

    canvas.on('mouse:down', function (opt) {
        var evt = opt.e;
        if (evt.altKey === true) {
            this.isDragging = true;
            this.selection = false;
            this.lastPosX = evt.clientX;
            this.lastPosY = evt.clientY;
        }
    });

    canvas.on('mouse:move', function (opt) {
        if (this.isDragging) {
            var e = opt.e;
            var vpt = this.viewportTransform;
            var dx = e.clientX - this.lastPosX;
            var dy = e.clientY - this.lastPosY;
            vpt[4] += dx;
            vpt[5] += dy;
            this.setViewportTransform(this.viewportTransform);
            updateFn();
            this.requestRenderAll();
            this.lastPosX = e.clientX;
            this.lastPosY = e.clientY;
        }
    });
    canvas.on('mouse:up', function (opt) {
        // on mouse up we want to recalculate new interaction
        // for all objects, so we call setViewportTransform
        //this.setViewportTransform(this.viewportTransform);
        this.isDragging = false;
        this.selection = true;
    });
}