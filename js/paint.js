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
    droplet.style.left = (obj.clientX - canvasX - (paintbrush.size / 2)) + "px";
    droplet.style.top = (obj.clientY - canvasY - (paintbrush.size / 2)) + "px";
    return droplet;
}

canvas.updateSize = function (obj) {
    canvas.element.style.width = obj.target.value + "px";
    canvas.element.style.height = obj.target.value + "px";
    canvas.resizeBorders();
}

canvas.saveOrLoad = function (event) {
    if (event.target.textContent.toLowerCase() === "save") {
        showModal("Save Painting", "Please enter a name for your painting below.", "Save", "Name: ");
    } else {
        canvas.load();
    }
}

canvas.save = function () {
    canvasObj = {};
    canvasObj.name = document.getElementById('modal-input').value;
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
    showModal("Save successful!", "Your painting \"" + canvasObj.name + "\" has been saved.", "Great!");
}

canvas.load = function () {
    canvas.element.innerHTML = "";
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
    showModal("Load Painting", "Your painting " + canvasObj.name + " has been loaded.", "Great!");
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
        document.getElementById('clear').addEventListener('click', function () { canvas.element.innerHTML = ""});
        document.getElementById('save').addEventListener('click', canvas.saveOrLoad);
        document.getElementById('load').addEventListener('click', canvas.saveOrLoad);
        document.getElementById('change-size').addEventListener('change', paintbrush.sizeChange);
        document.getElementById('change-shape').addEventListener('change', paintbrush.shapeChange);
        document.getElementById('canvas-size').addEventListener('input', canvas.updateSize);
    }
}

function showModal(title, content, buttonText, inputDescription) {
    var modal = document.getElementById('modal');
    var modalTitle = document.getElementById('modal-header');
    var modalContent = document.getElementById('modal-content');
    var modalInputDescription = document.getElementById('modal-input-description');
    var modalInput = document.getElementById('modal-input');
    var modalButton = document.getElementById('modal-button');
    modalTitle.textContent = title;
    modalContent.textContent = content;
    if (inputDescription == undefined || inputDescription == "") {
        modalInputDescription.style.display = "none";
        modalInput.style.display = "none";
    } else {
        modalInput.style.display = "inline-block";
        modalInput.value = "";
        modalInputDescription.style.display = "inline";
        modalInputDescription.textContent = inputDescription;
    }
    modalButton.textContent = buttonText;
    if (buttonText.toLowerCase() === "save") {
        modalButton.addEventListener('click', canvas.save);
    } else if (buttonText.toLowerCase() === "load") {
        modalButton.addEventListener('click', canvas.load);
    } else {
        modalButton.addEventListener('click',hideModal);
    }
    modal.style.display = "block";
}

function hideModal() {
    document.getElementById('modal').style.display = "none";
    document.getElementById('modal-input').value = "";
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

var mousedown = false;

startPaint();