var paintbrush = {
    color: "black",
    size: 6,
    shape: "circle",
}

var canvas = {
    element: document.getElementById('canvas'),
}

var palette = {
    colors: Array.from(document.getElementsByClassName('color')),
    sizes: Array.from(document.getElementsByClassName('size')),
    shapes: Array.from(document.getElementsByClassName('shape'))
}

var body = document.getElementsByTagName('body')[0];
var mousedown = false;
var zCounter = 0;


function colorChange(event) {
    paintbrush.color = window.getComputedStyle(event.target).backgroundColor;
    for (var i = 0; i < palette.colors.length; i++) {
        palette.colors[i].style.borderColor = "black";
    }
    event.target.style.borderColor = "skyblue";
}

function sizeChange() {
    var chosenSize = parseInt(palette.sizes.filter(el => el.selected)[0].textContent.replace(" px", ""));
    paintbrush.size = chosenSize;
}

function shapeChange() {
    var chosenShape = palette.shapes.filter(el => el.selected)[0].textContent.toLowerCase();
    paintbrush.shape = chosenShape;
}

function mouseHold(event) {
    if (event.type === "mousedown") {
        mousedown = true;
    } else {
        mousedown = false;
    }
}

function createDroplet(obj) {
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
    droplet.style.zIndex = zCounter;
    zCounter++;
    return droplet;
}

function paint(obj) {
    if (obj.type === "click") {
        canvas.element.appendChild(createDroplet(obj));
    }
    if (mousedown) {
        canvas.element.appendChild(createDroplet(obj));
    }
}

document.getElementById('clear-canvas').addEventListener('click', function () { canvas.element.innerHTML = "" })
document.getElementById('change-size').addEventListener('change', sizeChange);
document.getElementById('change-shape').addEventListener('change', shapeChange);
body.addEventListener('mousedown', mouseHold);
body.addEventListener('mouseup', mouseHold);
body.addEventListener('click', mouseHold);
canvas.element.addEventListener('click', mouseHold);
canvas.element.addEventListener('click', paint);
canvas.element.addEventListener('mousemove', paint);
for (var i = 0; i < palette.colors.length; i++) {
    palette.colors[i].addEventListener('click', colorChange);
}