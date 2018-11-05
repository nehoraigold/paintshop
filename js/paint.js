var paintbrush = {
    color: "black",
    size: 4,
    shape: "circle"
}
var body = document.getElementsByTagName('body')[0];
var canvas = document.getElementById('canvas');
var mousedown = false;

function mouseHold(event) {
    if (event.type === "mousedown") {
        mousedown = true;
    } else {
        mousedown = false;
    }
}

function paint(obj) {
    if (mousedown) {
        if (obj.target.id === "canvas") {
            var droplet = document.createElement("div");
            droplet.style.backgroundColor = paintbrush.color;
            droplet.style.width = paintbrush.size + "px";
            droplet.style.height = paintbrush.size + "px";
            if (paintbrush.shape === "circle") {
                droplet.style.borderRadius = "50%";
            }
            droplet.style.position = "absolute";
            droplet.style.left = (obj.offsetX) + "px";
            droplet.style.top = (obj.offsetY) + "px";
            canvas.appendChild(droplet);
        }
    }
}

document.getElementById('clear-canvas').addEventListener('click', function() {canvas.innerHTML = ""})
canvas.addEventListener('click',paint)
canvas.addEventListener('mousemove',paint)
body.addEventListener('mousedown',mouseHold);
body.addEventListener('mouseup',mouseHold);
canvas.addEventListener('click',mouseHold)