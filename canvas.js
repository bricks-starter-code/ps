document.body.innerHTML += "<canvas id='canv' oncontextmenu='return false;'></canvas>";

var link = document.createElement("link");

link.href = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

link.rel = "icon";

link.type = "image/x-icon";

document.getElementsByTagName("head")[0].appendChild(link);

document.body.style.setProperty("margin", "0px");

document.documentElement.style.setProperty("margin", "0px");

document.documentElement.style.setProperty("overflow", "hidden");

document.getElementById("canv").addEventListener("mousemove", mouseMove);

document.getElementById("canv").addEventListener("mousedown", mouseDown);

document.getElementById("canv").addEventListener("mouseup", mouseUp);

document.getElementById("canv").addEventListener("mousewheel", mouseWheel);

document.title = "PS";

let o = {};

function bootOptions() {
    o.width = 0;
    o.height = 0;
    o.cameraCenterX = 0;
    o.cameraCenterY = 0;
    o.isMouseDown = false;
    o.lastMouseX = 0;
    o.lastMouseY = 0;
    o.maxZoom = 100;
    o.minZoom = .1;
    o.cameraZoom = 1;
    o.fillColor = "lightgray";
    o.millisecondsBetweenFrames = 33;
    o.secondsBetweenFrames = 1 / o.millisecondsBetweenFrames;
    o.time = o.secondsBetweenFrames;
    o.disableCameraMovement = false;
    o.tickOne = false;
    o.drawGrid = false;
    o.drawGridInFront = false;
}

bootOptions();

let c;

let canvas;

canvas = document.getElementById("canv");

c = canvas.getContext("2d");

o.toWorldSpace = function(screenX, screenY) {
    let x = screenX - (o.width / 2 - o.cameraCenterX);
    let y = screenY - (o.height / 2 - o.cameraCenterY);
    x /= o.cameraZoom;
    y /= o.cameraZoom;
    return [ x, y ];
};

o.toScreenSpace = function(worldX, worldY) {
    let x = worldX * o.cameraZoom;
    let y = worldY * o.cameraZoom;
    x += o.width / 2 - o.cameraCenterX;
    y += o.height / 2 - o.cameraCenterY;
    return [ x, y ];
};

o.lookAt = function(x, y) {
    o.cameraCenterX = x * o.cameraZoom;
    o.cameraCenterY = y * -o.cameraZoom;
    return this;
};

o.zoom = function(z) {
    let h = c.canvas.height;
    z = h / z;
    o.cameraZoom = z;
    return this;
};

function resizeCanvas() {
    o.width = window.innerWidth;
    o.height = window.innerHeight;
    canvas.width = o.width;
    canvas.height = o.height;
}

function cs() {
    if (!o.scenes) return null;
    return o.scenes[o.currentScene];
}

function isFunc(reference) {
    return typeof reference === "function";
}

function initialBoot() {
    i.attach(document);
    resizeCanvas();
    if (typeof firstUpdate === "function") {
        firstUpdate(c, o);
    }
    if (o.scenes) {
        o.currentScene = 0;
        o.sceneChange = false;
        o.changeScene = function(index) {
            o.newSceneIndex = index;
            o.sceneChange = true;
            bootOptions();
        };
        typeof cs().firstUpdate === "function" ? cs().firstUpdate(c, o) : {};
    }
    if (!(typeof o.tickOnce !== "undefined" && o.tickOnce)) setInterval(tick, o.millisecondsBetweenFrames);
}

function tick() {
    var currentTime = new Date();
    var now = currentTime.getTime();
    update();
    drawCanvas();
}

function update() {
    i.update();
    if (o?.sceneChange) {
        o.sceneChange = false;
        o.currentScene = o.newSceneIndex;
        if (typeof cs()?.firstUpdate === "function") cs().firstUpdate(c, o);
    }
    if (typeof customUpdate === "function") {
        customUpdate(c, o);
    }
    if (typeof cs()?.customUpdate === "function") cs().customUpdate(c, o);
    drawCanvas();
}

function drawTheGrid() {
    $$.fo("10px Arial").fi("white");
    let ulx, uly;
    [ ulx, uly ] = o.toWorldSpace(0, 0);
    let lrx, lry;
    [ lrx, lry ] = o.toWorldSpace(c.canvas.width, c.canvas.height);
    let startX, startY, stopX, stopY;
    let base = 10;
    let min = Math.min(lrx - ulx, lry - uly);
    let step = Math.log10(min) / Math.log10(base);
    step = Math.floor(step - .5);
    step = Math.pow(base, step);
    startX = parseInt((ulx - step) / step) * step;
    stopX = lrx;
    startY = parseInt((uly - step) / step) * step;
    stopY = lry;
    for (let x = startX; x <= stopX; x += step) {
        let tx, ty, t2;
        [ tx, ty ] = o.toScreenSpace(x, startY);
        [ tx, t2 ] = o.toScreenSpace(x, stopY);
        c.strokeStyle = "gray";
        if (x == 0) c.strokeStyle = "green";
        c.beginPath();
        c.moveTo(tx, ty);
        c.lineTo(tx, t2);
        c.stroke();
        c.fillStyle = "white";
        c.fillText(x.toFixed(2), tx + 20, 20);
    }
    for (let y = startY; y <= stopY; y += step) {
        let tx, ty, tx2;
        [ tx, ty ] = o.toScreenSpace(startX, y);
        [ tx2, ty ] = o.toScreenSpace(stopX, y);
        c.strokeStyle = "gray";
        if (y == 0) c.strokeStyle = "red";
        c.beginPath();
        c.moveTo(tx, ty);
        c.lineTo(tx2, ty);
        c.stroke();
        c.fillStyle = "white";
        c.fillText((-y).toFixed(2), 20, ty + 20);
    }
}

function drawCanvas() {
    resizeCanvas();
    c.fillStyle = o.fillColor;
    c.fillRect(0, 0, canvas.width, canvas.height);
    if (o.drawGrid && !o.drawGridInFront) drawTheGrid();
    c.save();
    c.translate(o.width / 2 - o.cameraCenterX, o.height / 2 - o.cameraCenterY);
    c.scale(o.cameraZoom, -o.cameraZoom);
    if (typeof customDraw === "function") {
        customDraw(c, o);
    }
    if (typeof cs()?.customDraw === "function") cs().customDraw(c, o);
    c.restore();
    if (o.drawGrid && o.drawGridInFront) drawTheGrid();
    if (typeof cs()?.customUI === "function") cs().customUI(c, o);
}

function mouseMove(e) {
    if (isCameraDisabled()) return;
    let currentMouseX = e.clientX;
    let currentMouseY = e.clientY;
    if (o.isMouseDown) {
        let diffX = currentMouseX - o.lastMouseX;
        let diffY = currentMouseY - o.lastMouseY;
        o.cameraCenterX -= diffX;
        o.cameraCenterY -= diffY;
    }
    o.lastMouseX = e.clientX;
    o.lastMouseY = e.clientY;
}

function mouseDown(e) {
    if (isCameraDisabled()) return;
    let currentMouseX = e.clientX;
    let currentMouseY = e.clientY;
    o.lastMouseX = e.clientX;
    o.lastMouseY = e.clientY;
    o.isMouseDown = true;
}

function mouseUp(e) {
    if (isCameraDisabled()) return;
    let currentMouseX = e.clientX;
    let currentMouseY = e.clientY;
    o.lastMouseX = e.clientX;
    o.lastMouseY = e.clientY;
    o.isMouseDown = false;
}

function mouseWheel(e) {
    if (isCameraDisabled()) return;
    let x = e.clientX - (o.width / 2 - o.cameraCenterX);
    let y = e.clientY - (o.height / 2 - o.cameraCenterY);
    x /= o.cameraZoom;
    y /= o.cameraZoom;
    if (e.wheelDelta > 0) {
        o.cameraZoom *= 1.01;
    } else if (e.wheelDelta < 0) {
        o.cameraZoom /= 1.01;
    }
    if (o.cameraZoom > o.maxZoom) {
        o.cameraZoom = o.maxZoom;
    }
    if (o.cameraZoom < o.minZoom) {
        o.cameraZoom = o.minZoom;
    }
    let x2 = e.clientX - (o.width / 2 - o.cameraCenterX);
    let y2 = e.clientY - (o.height / 2 - o.cameraCenterY);
    x2 /= o.cameraZoom;
    y2 /= o.cameraZoom;
    o.cameraCenterX -= x2 - x;
    o.cameraCenterY -= y2 - y;
}

function isCameraDisabled() {
    return typeof o.disableCameraMovement !== "undefined" && o.disableCameraMovement;
}

class i {
    static keys = [];
    static keysDown = [];
    static keysUp = [];
    static frameKeysDown = [];
    static frameKeysUp = [];
    static mouseButtons = [];
    static mouseButtonsDown = [];
    static mouseButtonsUp = [];
    static frameMouseButtonsDown = [];
    static frameMouseButtonUp = [];
    static mousePositionX;
    static mousePositionY;
    static frameMousePositionX;
    static frameMousePositionY;
    static lastFrameMousePositionX;
    static lastFrameMousePositionY;
    static scrollWheel = 0;
    static frameScrollWheel = 0;
    static update() {
        this.frameKeysDown = this.keysDown;
        this.frameKeysUp = this.keysUp;
        this.keysDown = [];
        this.keysUp = [];
        this.frameMouseButtonsDown = this.mouseButtonsDown;
        this.frameMouseButtonsUp = this.mouseButtonsUp;
        this.mouseButtonsDown = [];
        this.mouseButtonsUp = [];
        this.lastFrameMousePositionX = this.frameMousePositionX;
        this.lastFrameMousePositionY = this.frameMousePositionY;
        this.frameMousePositionX = this.mousePositionX;
        this.frameMousePositionY = this.mousePositionY;
        this.frameScrollWheel = this.scrollWheel;
        this.scrollWheel = 0;
    }
    static getKey(key) {
        return this.keys[key];
    }
    static getKeyDown(key) {
        return this.frameKeysDown[key];
    }
    static down(key, lambda) {
        if (i.getKeyDown(key)) lambda();
    }
    static getKeyUp(key) {
        return this.frameKeysUp[key];
    }
    static getMouseButton(button) {
        return this.mouseButtons[button];
    }
    static getMouseButtonDown(button) {
        return this.frameMouseButtonsDown[button];
    }
    static getMouseButtonUp(button) {
        return this.frameMouseButtonsUp[button];
    }
    static getScrollWheel() {
        return this.frameScrollWheel;
    }
    static getMousePosition() {
        return {
            x: this.frameMousePositionX,
            y: this.frameMousePositionY
        };
    }
    static getMousePositionDelta() {
        return {
            dx: this.frameMousePositionX - this.lastFrameMousePositionX,
            dy: this.frameMousePositionY - this.lastFrameMousePositionY
        };
    }
    static attach(document) {
        document.body.addEventListener("keydown", keydown);
        document.body.addEventListener("keyup", keyup);
        document.body.addEventListener("keypress", keypress);
        document.body.addEventListener("mousedown", mousedown);
        document.body.addEventListener("mouseup", mouseup);
        document.body.addEventListener("mousemove", mousemove);
        document.body.addEventListener("wheel", wheelevent);
        document.body.addEventListener("contextmenu", contextmenu);
        function keydown(event) {
            if (i.keys[event.key] != true) i.keysDown[event.key] = true;
            i.keys[event.key] = true;
        }
        function keyup(event) {
            if (i.keys[event.key] != false) i.keysUp[event.key] = true;
            i.keys[event.key] = false;
        }
        function mousedown(event) {
            if (i.mouseButtons["" + event.button] != true) i.mouseButtonsDown["" + event.button] = true;
            i.mouseButtons["" + event.button] = true;
        }
        function mouseup(event) {
            if (i.mouseButtons[event.button] != false) i.mouseButtonsUp[event.button] = true;
            i.mouseButtons[event.button] = false;
        }
        function mousemove(event) {
            i.mousePositionX = event.clientX;
            i.mousePositionY = event.clientY;
        }
        function wheelevent(event) {
            if (event.deltaY != 0) i.mouseScrollDelta = event.deltaY;
        }
        function keypress(event) {}
        function contextmenu(event) {
            if (event.preventDefault != undefined) event.preventDefault();
            if (event.stopPropagation != undefined) event.stopPropagation();
            return false;
        }
    }
}

function collisionRectRect(cx, cy, rx, ry, cx1, cy1, rx1, ry1) {
    const collision = !(cx - rx > cx1 + rx1 || cx + rx < cx1 - rx1 || cy - rx > cy1 + ry1 || cy + ry < cy1 - ry1);
    return collision;
}

initialBoot();

$$ = {};

$$.b = function() {
    c.beginPath();
    return this;
};

$$.m = function(x, y) {
    c.moveTo(x, y);
    return this;
};

$$.l = function(x, y) {
    c.lineTo(x, y);
    return this;
};

$$.s = function() {
    c.stroke();
    return this;
};

$$.f = function() {
    c.fill();
    return this;
};

$$.st = function(style) {
    c.strokeStyle = style;
    return this;
};

$$.fi = function(style) {
    c.fillStyle = style;
    return this;
};

$$.fo = function(font) {
    c.font = font;
    return this;
};

$$.text = function(text, x, y) {
    c.fillText(text, x, y);
    return this;
};

$$.tc = function(t, x, y) {
    let mt = c.measureText(t);
    this.text(t, x - mt.width / 2, y - mt.fontBoundingBoxAscent / 2);
    return this;
};

$$.circle = function(x, y, r) {
    c.arc(x, y, r, 0, Math.PI * 2);
    return this;
};

$$.fillRectCentered = function(x, y, rx, ry) {
    c.fillRect(x - rx, y - ry, rx * 2, ry * 2);
    return this;
};
