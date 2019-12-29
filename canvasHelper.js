colours = Object.freeze({
    black: "#000",
    grey: "#777",
    green: "#0F0",
    red: "#F00",
    blue: "#00F",
    orange: "#F80",
    pink: "#F58",
    indigo: "#4B0082"
});

formatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 4 });

function drawLine(ctx, points, colour = colours.black, thickness = 1, closePath = false) {
    ctx.beginPath();

    ctx.moveTo(points[0].x, points[0].y);
    for(var i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }

    if (closePath) {
        ctx.closePath();
    }

    ctx.strokeStyle = colour;
    ctx.lineWidth = thickness;

    ctx.save(); // Cache current scalling
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scalling to 100% avoid changing line sizes
    ctx.stroke();
    ctx.restore(); // Go back to previous scalling
}

function renderText(ctx, position, text, colour) {
    ctx.font = "12px Arial";
    ctx.fillStyle = colour;
    ctx.textAlign = "left";

    // TODO check scalling here
    ctx.fillText(text, position.x, position.y);
}

function formatNumber(number) {
    return formatter.format(number);
}

function renderHexDimensions(actualHex) {
    var offset = 20.0;
    var pad = 6.0;
    var canvas = document.getElementById("visualOut");
    var ctx = canvas.getContext("2d");

    var hex = new Hex({ sideLength: 100.0 });
    var hexPoints = new Grid(hex).hex.hexPointsAtOffset({ x: offset, y: offset });
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawLine(ctx, hexPoints, colours.grey, 1, true);

    // sideLength
    drawLine(ctx, [hexPoints[0], hexPoints[1]], colours.red, 3);
    renderText(ctx, { x: hexPoints[1].x + pad, y: hexPoints[1].y }, "Side: " + formatNumber(actualHex.side), colours.red);

    // width
    drawLine(ctx, [hexPoints[1], hexPoints[4]], colours.green, 3);
    renderText(ctx, { x: hexPoints[4].x + pad * 6, y: hexPoints[4].y - pad * 6 }, "Width: " + formatNumber(actualHex.width), colours.green);

    // height
    drawLine(ctx, [hexPoints[0], hexPoints[4]], colours.blue, 3);
    renderText(ctx, { x: hexPoints[4].x + pad, y: hexPoints[4].y + pad * 2 }, "Height: " + formatNumber(actualHex.height), colours.blue);

    // section width
    var sectionWidthPoints = [
        { x: hexPoints[2].x,                    y: hexPoints[2].y },
        { x: hexPoints[2].x - hex.sectionWidth, y: hexPoints[2].y }
    ];
    drawLine(ctx, sectionWidthPoints, colours.pink, 3);
    renderText(ctx, { x: hexPoints[2].x + pad, y: hexPoints[2].y }, "s Width: " + formatNumber(actualHex.sectionWidth), colours.pink);

    // section height / r
    var sectionWidthPoints = [
        { x: hexPoints[3].x, y: hexPoints[3].y },
        { x: hexPoints[3].x, y: hexPoints[3].y - hex.sectionHeight }
    ];
    drawLine(ctx, sectionWidthPoints, colours.orange, 3);
    renderText(ctx, { x: hexPoints[3].x + pad * 4, y: hexPoints[3].y - pad * 4 }, "s Height (r): " + formatNumber(actualHex.r), colours.orange);

    // h
    var hPoints = [
        { x: hexPoints[3].x,            y: hexPoints[3].y },
        { x: hexPoints[3].x + hex.h,    y: hexPoints[3].y }
    ];
    drawLine(ctx, hPoints, colours.indigo, 3);
    renderText(ctx, { x: hexPoints[3].x + hex.h + pad, y: hexPoints[3].y }, "(h): " + formatNumber(actualHex.h), colours.indigo);
}

function renderGrid(grid, boundaryRectangle, scale) {
    var canvas = document.getElementById("visualGridOut");
    var ctx = canvas.getContext("2d");

    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scalling
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.scale(scale, scale);

    for(var xx = 0; xx < grid.across; xx++) {
        for(var yy = 0; yy < grid.down; yy++) {
            if (!grid.shouldRenderHexForGridPosition(xx, yy)) {
                // don't render the trailing hex on even columns
                continue;
            }

            drawLine(ctx, grid.hex.hexPointsAtOffset(grid.offsetForGridPosition(xx, yy)), colours.grey, 1, true);
        }
    }

    if (boundaryRectangle) {
        var squarePoints = [
            { x: 0.0, y: 0.0 },
            { x: boundaryRectangle.width, y: 0.0 },
            { x: boundaryRectangle.width, y: boundaryRectangle.height },
            { x: 0.0, y: boundaryRectangle.height },
        ];
        drawLine(ctx, squarePoints, colours.black, 2, true); // rect() doesn't allow for handling canvas scalling
    }
}