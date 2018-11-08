var paintbrush = {
    color: "black",
    size: 6,
    shape: "circle"
}

paintbrush.sizeChange = function () {
    var chosenSize = parseInt(palette.sizes.filter(el => el.selected)[0].textContent.replace(" px", ""));
    paintbrush.size = chosenSize;
}

paintbrush.shapeChange = function () {
    var chosenShape = palette.shapes.filter(el => el.selected)[0].textContent.toLowerCase();
    paintbrush.shape = chosenShape;
}

paintbrush.colorChange = function (event) {
    paintbrush.color = window.getComputedStyle(event.target).backgroundColor;
    for (var i = 0; i < palette.colors.length; i++) {
        palette.colors[i].style.borderColor = "black";
    }
    event.target.style.borderColor = "skyblue";
}
var canvas = {
    element: document.getElementById('canvas')
}

canvas.paint = function (obj) {
    if (obj.type === "click") {
        canvas.element.appendChild(canvas.createDroplet(obj));
    }
    if (mousedown) {
        canvas.element.appendChild(canvas.createDroplet(obj));
    }
}

canvas.createDroplet = function (obj) {
    var canvasX = canvas.element.getBoundingClientRect().x;
    var canvasY = canvas.element.getBoundingClientRect().y;
    var droplet = document.createElement("div");
    droplet.style.backgroundColor = paintbrush.color;
    droplet.style.width = paintbrush.size + "px";
    droplet.style.height = paintbrush.size + "px";
    if (paintbrush.shape === "circle") {
        droplet.style.borderRadius = "50%";
    }
    droplet.style.position = "absolute";
    droplet.style.left = (obj.clientX - canvasX - 4) + "px";
    droplet.style.top = (obj.clientY - canvasY - 4) + "px";
    return droplet;
}

canvas.bindCanvasActions = function () {
    canvas.element.addEventListener('click', mouseHold);
    canvas.element.addEventListener('click', canvas.paint);
    canvas.element.addEventListener('mousemove', canvas.paint);
}

var palette = {
    colors: Array.from(document.getElementsByClassName('color')),
    sizes: Array.from(document.getElementsByClassName('size')),
    shapes: Array.from(document.getElementsByClassName('shape'))
}

palette.bindPaletteActions = function () {
    document.getElementById('change-size').addEventListener('change', paintbrush.sizeChange);
    document.getElementById('change-shape').addEventListener('change', paintbrush.shapeChange);
    for (var i = 0; i < palette.colors.length; i++) {
        palette.colors[i].addEventListener('click', paintbrush.colorChange);
    }
}

var menu = {
    bindMenuActions: function () {
        document.getElementById('clear-canvas').addEventListener('click', function () { canvas.element.innerHTML = "" });
        document.getElementById('change-size').addEventListener('change', paintbrush.sizeChange);
        document.getElementById('change-shape').addEventListener('change', paintbrush.shapeChange);
    }
}

function bindWindowActions() {
    window.addEventListener('mousedown', mouseHold);
    window.addEventListener('mouseup', mouseHold);
    window.addEventListener('click', mouseHold);    
}

function startPaint() {
    canvas.bindCanvasActions();
    menu.bindMenuActions();
    palette.bindPaletteActions();
    bindWindowActions();
}

function mouseHold(event) {
    if (event.type === "mousedown") {
        mousedown = true;
    } else {
        mousedown = false;
    }
}

var mousedown = false;

startPaint();