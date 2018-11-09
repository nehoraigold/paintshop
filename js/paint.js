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
    for (var i = 0; i < palette.colors.length; i++) {
        palette.colors[i].style.borderColor = "black";
    }
    palette.colorPicker.style.borderColor = "black";
    event.target.style.borderColor = "skyblue";
    if (event.target === palette.colorPicker) {
        paintbrush.color = palette.colorPicker.value;
    } else {
        paintbrush.color = window.getComputedStyle(event.target).backgroundColor;
    }
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

canvas.updateSize = function (obj) {
    canvas.element.style.width = obj.target.value + "px";
    canvas.element.style.height = obj.target.value + "px";
    canvas.resizeBorders();
}

canvas.save = function () {
    var paintingName = prompt("Enter a name for your painting.");
    canvasObj = {};
    canvasObj.name = paintingName;
    canvasObj.size = document.getElementById('canvas-size').value + "px";
    canvasObj.droplets = [];
    var allDroplets = canvas.element.childNodes;
    for (var i = 0; i < allDroplets.length; i++) {
        var droplet = {};
        droplet.size = allDroplets[i].style.height;
        droplet.color = allDroplets[i].style.backgroundColor;
        droplet.borderRadius = allDroplets[i].style.borderRadius;
        droplet.top = allDroplets[i].style.top;
        droplet.left = allDroplets[i].style.left;
        canvasObj.droplets.push(droplet);
    }
    window.localStorage.setItem("painting", JSON.stringify(canvasObj));
    alert("Your painting has been saved.");
}

canvas.load = function () {
    var canvasObj = JSON.parse(window.localStorage.painting);
    canvas.element.style.width = canvasObj.size;
    canvas.element.style.height = canvasObj.size;
    document.getElementById('canvas-size').value = parseInt(canvasObj.size.replace("px", ""));
    var dropletObjects = canvasObj.droplets;
    for (var i = 0; i < dropletObjects.length; i++) {
        var dropletElement = document.createElement('div');
        dropletElement.style.height = dropletObjects[i].size;
        dropletElement.style.width = dropletObjects[i].size;
        dropletElement.style.backgroundColor = dropletObjects[i].color;
        dropletElement.style.borderRadius = dropletObjects[i].borderRadius;
        dropletElement.style.top = dropletObjects[i].top;
        dropletElement.style.left = dropletObjects[i].left;
        dropletElement.style.position = "absolute";
        canvas.element.appendChild(dropletElement);
    }
    alert("Painting \"" + canvasObj.name + "\" loaded!");
}

canvas.bindCanvasActions = function () {
    canvas.element.addEventListener('click', mouseHold);
    canvas.element.addEventListener('click', canvas.paint);
    canvas.element.addEventListener('mousemove', canvas.paint);
}

var palette = {
    colors: Array.from(document.getElementsByClassName('color')),
    sizes: Array.from(document.getElementsByClassName('size')),
    shapes: Array.from(document.getElementsByClassName('shape')),
    colorPicker: document.getElementById('color-picker')
}

palette.bindPaletteActions = function () {
    document.getElementById('change-size').addEventListener('change', paintbrush.sizeChange);
    document.getElementById('change-shape').addEventListener('change', paintbrush.shapeChange);
    palette.colorPicker.addEventListener('change', paintbrush.colorChange);
    for (var i = 0; i < palette.colors.length; i++) {
        palette.colors[i].addEventListener('click', paintbrush.colorChange);
    }
}

var menu = {
    element: document.getElementById('menu-container'),
    bindMenuActions: function () {
        document.getElementById('clear').addEventListener('click', function () { canvas.element.innerHTML = "" });
        document.getElementById('save').addEventListener('click', canvas.save);
        document.getElementById('load').addEventListener('click', canvas.load);
        document.getElementById('change-size').addEventListener('change', paintbrush.sizeChange);
        document.getElementById('change-shape').addEventListener('change', paintbrush.shapeChange);
        document.getElementById('canvas-size').addEventListener('input', canvas.updateSize);
    }
}

function bindWindowActions() {
    window.addEventListener('mousedown', mouseHold);
    window.addEventListener('mouseup', mouseHold);
    window.addEventListener('click', mouseHold);
    window.addEventListener('load', canvas.resizeBorders);
    window.addEventListener('resize', canvas.resizeBorders);
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

// canvas.hideOutOfBoundsDroplets = function () {
//     var allDroplets = canvas.element.childNodes;
//     for (var i = 0; i < allDroplets.length; i++) {
//         var rect = allDroplets[i].getBoundingClientRect();
//         if ((rect.x + rect.width < 0) || (rect.y + rect.height < 0) || rect.x > window.innerWidth || rect.y > window.innerHeight) {
//             allDroplets[i].style.display = "none";
//         }
//     }
// }

canvas.resizeBorders = function () {
    MENU_HEIGHT = parseInt(menu.element.style.height.replace('px', "")) || parseInt(window.getComputedStyle(menu.element).height.replace("px", ""));
    menuWidth = parseInt(menu.element.style.width.replace('px', '')) || parseInt(window.getComputedStyle(menu.element).width.replace('px', ''));
    var rightBorder = document.getElementById('border-right');
    var bottomBorder = document.getElementById('border-bottom');
    var screenWidth = window.innerWidth;
    var screenHeight = window.innerHeight;
    var canvasSize = parseInt(document.getElementById('canvas-size'));
    rightBorder.style.height = canvas.element.style.height || "500px";
    document.getElementsByClassName('flex')[0].style.height = canvas.element.style.height || "500px";
    bottomBorder.style.width = "100%";
    if (canvasSize > screenWidth) {
        rightBorder.style.display = "none";
    } else {
        rightBorder.style.width = (screenWidth - canvas.element.offsetWidth) + "px";
    }
    if ((canvasSize + MENU_HEIGHT) > screenHeight) {
        bottomBorder.style.display = "none";
    } else {
        bottomBorder.style.height = (screenHeight - canvas.element.offsetHeight - MENU_HEIGHT) + "px";
    }
    if (menuWidth < canvasSize) {
        menu.element.style.width = canvasSize + "px";
    } else {
        menu.element.style.width = screenWidth + "px";
    }
    // canvas.hideOutOfBoundsDroplets();
}

var mousedown = false;

startPaint();