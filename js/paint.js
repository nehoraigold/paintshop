var paintbrush = {
    color: "black",
    size: 4,
    shape: "circle"
}

var body = document.getElementsByTagName('body')[0];
var colors = Array.from(document.getElementsByClassName('color'));
var sizes = Array.from(document.getElementsByClassName('size'));
var shapes = Array.from(document.getElementsByClassName('shape'));
var canvas = document.getElementById('canvas');
var mousedown = false;

for (var i = 0; i < colors.length; i++) {
    colors[i].addEventListener('click', colorChange);
}

function colorChange(event) {
    paintbrush.color = window.getComputedStyle(event.target).backgroundColor;
    for (var i = 0; i < colors.length; i++) {
        colors[i].style.borderColor = "black";
    }
    event.target.style.borderColor = "skyblue";
}

function sizeChange() {
    var chosenSize = parseInt(sizes.filter(el => el.selected)[0].textContent.replace(" px",""));
    paintbrush.size = chosenSize;
}

function shapeChange() {
    var chosenShape = shapes.filter(el => el.selected)[0].textContent.toLowerCase();
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
    var canvasX = canvas.getBoundingClientRect().x;
    var canvasY = canvas.getBoundingClientRect().y;
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

function paint(obj) {
    if (obj.type === "click") {
        canvas.appendChild(createDroplet(obj));
    }
    if (mousedown) {
        if (obj.target === canvas) {
            canvas.appendChild(createDroplet(obj));
        }
    }
}

document.getElementById('clear-canvas').addEventListener('click', function () { canvas.innerHTML = "" })
document.getElementById('change-size').addEventListener('change', sizeChange);
document.getElementById('change-shape').addEventListener('change', shapeChange);
canvas.addEventListener('click', paint);
canvas.addEventListener('mousemove', paint)
body.addEventListener('mousedown', mouseHold);
body.addEventListener('mouseup', mouseHold);
body.addEventListener('click', mouseHold);
canvas.addEventListener('click', mouseHold);