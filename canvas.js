/**
 * Usage:
 *
 * In a script tag, put in your custom code
 * After the your custom script, put in <script src="canvas.js"></script>
 *
 * If you have a function called customUpdate(), it will be called on the interval before any of the draw functions
 * If you have a function called customDraw(), it will be called after update on the same interval. customDraw() is called after centering 0,0 at the center of the screen
 * If you have a function called customUI(), it will be called after customDraw() in screen space
 *
 * If you set a variable called disableCameraMovement to something truthy, events will be ignored
 * If you set a variable called tickOnce to something truthy, the functions will only be called once.
 */


// Automatically add the canvas element to the DOM. This saves the user from
// having to add it manually, this keeping the html code to a minimum.
document.body.innerHTML += "<canvas id='canv' oncontextmenu='return false;'></canvas>";

// Add the link that sets the favicon
// See https://gist.github.com/chrisyip/1403858
var link = document.createElement('link');
link.href = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
link.rel = 'icon';
link.type = 'image/x-icon'; // no need for HTML5
document.getElementsByTagName('head')[0].appendChild(link); // for IE6

// Automatically generate the CSS for the page. This saves the user
// from having to include a CSS file or adding a style element to the head.
// These styles remove the margin around the canvas and remove scroll bars
document.body.style.setProperty('margin', '0px');
document.documentElement.style.setProperty('margin', '0px'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object
document.documentElement.style.setProperty('overflow', 'hidden'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object

//Add the event hooks so we can respond to the mouse.
document.getElementById('canv').addEventListener('mousemove', mouseMove);
document.getElementById('canv').addEventListener('mousedown', mouseDown);
document.getElementById('canv').addEventListener('mouseup', mouseUp);
document.getElementById('canv').addEventListener('mousewheel', mouseWheel);

//Set the title programmatically
document.title = "PS";

// Create the options object and populate it with the defaults
let o = {};

o.width = 0;  //Will store the width of the canvas
o.height = 0; //Will store the hegiht of the canvas

o.cameraCenterX = 0; //The x position the camera is looking at
o.cameraCenterY = 0; //The y position the camera is looking at

o.isMouseDown = false; //True if the mouse is down

//Helper variables for tracking mouse movement
o.lastMouseX = 0;
o.lastMouseY = 0;

//Set the default camera zoom
o.maxZoom = 100;
o.minZoom = .1
o.cameraZoom = 1;

//Set the default background color
o.fillColor = "lightgray"

//Set the frame rate
o.millisecondsBetweenFrames = 33
o.secondsBetweenFrames = 1 / o.millisecondsBetweenFrames
o.time = o.secondsBetweenFrames;

///Uncomment to disable mouse panning and zooming
//o.disableCameraMovement = true;

//Uncomment if update should only be run once
//o.tickOne = true;

let c;
let canvas

canvas = document.getElementById("canv");   ///Get the canvas object
c = canvas.getContext("2d");


o.toWorldSpace = function (screenX, screenY) {
  let x = screenX - (o.width / 2 - o.cameraCenterX);
  let y = screenY - (o.height / 2 - o.cameraCenterY)
  x /= o.cameraZoom;
  y /= o.cameraZoom;
  return [x, y]
}

o.toScreenSpace = function (worldX, worldY) {
  let x = worldX * o.cameraZoom;
  let y = worldY * o.cameraZoom;
  x += (o.width / 2 - o.cameraCenterX);
  y += (o.height / 2 - o.cameraCenterY);
  return [x, y];
}

o.lookAt = function (x, y) {
  o.cameraCenterX = x * o.cameraZoom;
  o.cameraCenterY = y * -o.cameraZoom;
  return this;
}

o.zoom = function (z) {
  let h = c.canvas.height;
  z = h / z
  // if(z > o.maxZoom)
  //   z = o.maxZoom;
  // if(z < o.minZoom)
  //   z = o.minZoom;

  o.cameraZoom = z;
  return this;
}

c.b = function () {
  c.beginPath();
  return this;
}
c.m = function (x, y) {
  c.moveTo(x, y)
  return this;
}
c.l = function (x, y) {
  c.lineTo(x, y);
  return this;
}
c.s = function () {
  c.stroke();
  return this;
}
c.f = function () {
  c.fill();
  return this;
}
c.st = function (style) {
  c.strokeStyle = style;
  return this;
}
c.fi = function (style) {
  c.fillStyle = style;
  return this;
}
c.fo = function (font) {
  c.font = font
  return this;
}
c.text = function (text, x, y) {
  c.fillText(text, x, y);
  return this;
}
c.tc = function(t, x,y){//Draw text centered
  let mt = c.measureText(t)
  console.log(mt)
  this.text(t, x - mt.width/2, y - mt.fontBoundingBoxAscent/2)
  return this
}
c.circle = function (x, y, r) {
  c.arc(x, y, r, 0, Math.PI * 2)
  return this;
}

function resizeCanvas() {
  //Grab the size of the window
  o.width = window.innerWidth;
  o.height = window.innerHeight;

  //set the size of the canvas
  canvas.width = o.width;
  canvas.height = o.height;
}

function cs(){
  return o.scenes[o.currentScene];
}

///This gets called once when the page is completetly loaded.
///Think main()
function initialBoot() {

  i.attach(document)

  ///Make sure everything is the right size
  resizeCanvas();


  //Call the firstUpdate function if it exists (only called once)
  if (typeof firstUpdate === "function") firstUpdate(c, o);

  if(o.scenes){
    o.currentScene = 0;
    o.sceneChange = false;
    o.changeScene = function(index){
      o.currentScene = index;
      o.sceneChange = true;
    }
  }
  if(typeof cs().firstUpdate === "function") cs().firstUpdate(c,o)

  ///Start a timer
  if (typeof o.tickOnce !== 'undefined' && o.tickOnce)
    //setTimeout(tick, o.millisecondsBetweenFrames)
    console.log("Ticking only once.")
  else {
    ///Update the model
    //update(o);
    setInterval(tick, o.millisecondsBetweenFrames);    								///Initialize the timer
  }
}

///This gets called evertime the timer ticks
function tick() {

  ///Respond differently based on the game state
  //timerID = setTimeout(tick, 33);    ///Restart the timer

  var currentTime = new Date();       ///Get the current time
  var now = currentTime.getTime();    ///Get the current time in milliseconds

  //Update the global model
  update();

  drawCanvas();
}

///This gets called whenever the window size changes and the
///canvas neends to adjust.
///This also adjusts the content pane
function update() {


  //Update the input class
  i.update();

  if(o?.sceneChange){
    o.sceneChange = false;
    if(typeof cs().firstUpdate === "function") cs().firstUpdate(c,o)
  }

  //If there is a custom update function, call it.
  if (typeof customUpdate === "function") {
    customUpdate(c, o);
  }
  if(typeof cs().customUpdate === "function") cs().customUpdate(c,o)


  drawCanvas();       ///Draw the canvas
}

///Called whenever the canvas needs to be redrawn
function drawCanvas() {
  //Update the canvas size in case there has been a change
  resizeCanvas()

  ///Clear the rectangles
  c.fillStyle = o.fillColor;
  c.fillRect(0, 0, canvas.width, canvas.height);

  //Draw a grid in UI space before anythig else if the user
  //has requested it
  if (o.drawGrid) {
    c.fo("10px Arial").fi("white")


    //The coordinates of the upper left (ul) and lower right (lr) coordinates
    let ulx, uly;
    [ulx, uly] = o.toWorldSpace(0, 0)
    let lrx, lry;
    [lrx, lry] = o.toWorldSpace(c.canvas.width, c.canvas.height)

    let startX, startY, stopX, stopY;

    //Set an arbitrary base
    let base = 10;
    let min = Math.min(lrx - ulx, lry - uly);
    let step = Math.log10(min) / Math.log10(base);
    step = Math.floor(step - .5);
    step = Math.pow(base, step);

    startX = parseInt((ulx - step) / step) * step
    stopX = lrx
    startY = parseInt((uly - step) / step) * step
    stopY = lry;

    for (let x = startX; x <= stopX; x += step) {
      let tx, ty, t2;
      [tx, ty] = o.toScreenSpace(x, startY);
      [tx, t2] = o.toScreenSpace(x, stopY);
      c.strokeStyle = "gray";
      if (x == 0)
        c.strokeStyle = "green"
      c.beginPath()
      c.moveTo(tx, ty);
      c.lineTo(tx, t2)
      c.stroke()

      c.fillStyle = "white"
      c.fillText(x.toFixed(2), tx + 20, 20);
    }

    for (let y = startY; y <= stopY; y += step) {
      let tx, ty, tx2;
      [tx, ty] = o.toScreenSpace(startX, y);
      [tx2, ty] = o.toScreenSpace(stopX, y);
      c.strokeStyle = "gray";
      if (y == 0)
        c.strokeStyle = "red"
      c.beginPath()
      c.moveTo(tx, ty);
      c.lineTo(tx2, ty)
      c.stroke()

      c.fillStyle = "white"
      c.fillText((-y).toFixed(2), 20, ty + 20);
    }
  }

  //Save transform before we account for the camera
  c.save();

  //Adjust for the camera
  c.translate(o.width / 2 - o.cameraCenterX, o.height / 2 - o.cameraCenterY);
  c.scale(o.cameraZoom, -o.cameraZoom);

  if (typeof customDraw === "function") {
    customDraw(c, o);
  }
  if(typeof cs().customDraw === "function") cs().customDraw(c,o)


  //Restore to pre-camera transform state
  c.restore();

  //Call customUI if the user has created this function
  if(typeof cs().customUI === "function") cs().customUI(c,o)

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
  o.isMouseDown = false
}

function mouseWheel(e) {
  if (isCameraDisabled()) return;

  //Figure out the current world space coordinate
  let x = e.clientX - (o.width / 2 - o.cameraCenterX);
  let y = e.clientY - (o.height / 2 - o.cameraCenterY)
  x /= o.cameraZoom;
  y /= o.cameraZoom;
  //x -= (width/2 - o.cameraCenterX);
  //y -= (height/2 - o.cameraCenterY);

  if (e.wheelDelta > 0) {
    o.cameraZoom *= 1.01;
  }
  else if (e.wheelDelta < 0) {
    o.cameraZoom /= 1.01;
  }

  if (o.cameraZoom > o.maxZoom) {
    o.cameraZoom = o.maxZoom;
  }
  if (o.cameraZoom < o.minZoom) {
    o.cameraZoom = o.minZoom
  }

  //Now figure out what the new world space coordinate has changed to

  let x2 = e.clientX - (o.width / 2 - o.cameraCenterX);
  let y2 = e.clientY - (o.height / 2 - o.cameraCenterY);
  x2 /= o.cameraZoom;
  y2 /= o.cameraZoom;
  //x2 -= (width/2 - o.cameraCenterX);
  //y2 -= (height/2 - o.cameraCenterY);

  o.cameraCenterX -= x2 - x;
  o.cameraCenterY -= y2 - y;
}

function isCameraDisabled() {
  return (typeof o.disableCameraMovement !== "undefined" && o.disableCameraMovement)
}

class i {
  static keys = []; // Keys that are currently down as reported by js events
  static keysDown = []; //Keys that went down this frame as reported by js events
  static keysUp = []; //Keys that went up this frame as reported by js events
  static frameKeysDown = []; //Keys that will be reported as going down next frame
  static frameKeysUp = [];  //Keys that will be reported as going up next frame

  static mouseButtons = []; //Mouse buttons that are currently down as reported by js events
  static mouseButtonsDown = []; //Mouse buttons that went down sometime this frame as reported by js events
  static mouseButtonsUp = []; //Mouse buttons that went up sometime this frame as reported by js events
  static frameMouseButtonsDown = []; //Mouse buttons that will be reported as going down next frame
  static frameMouseButtonUp = []; //Mouse buttons that will be reported as going up next frame

  static mousePositionX; //Mouse position x as reported by js events
  static mousePositionY; //Mouse position y as report by js events
  static frameMousePositionX; //The mouse position x that will be reported next frame
  static frameMousePositionY; //The mouse position y that will be reported next frame
  static lastFrameMousePositionX; //The mouse x position from the previously reported frame
  static lastFrameMousePositionY; //The mouse y position from the previously reported frame

  static scrollWheel = 0; //The scroll wheel position as report by js events
  static frameScrollWheel = 0; //The scroll wheel change that will be reported next frame

  //Update the frame-centric variables
  static update() {
    this.frameKeysDown = this.keysDown;
    this.frameKeysUp = this.keysUp;
    this.keysDown = [];
    this.keysUp = [];

    this.frameMouseButtonsDown = this.mouseButtonsDown;
    this.frameMouseButtonsUp = this.mouseButtonsUp;
    this.mouseButtonsDown = [];
    this.mouseButtonsUp = [];

    this.lastFrameMousePositionX = this.frameMousePositionX
    this.lastFrameMousePositionY = this.frameMousePositionY

    this.frameMousePositionX = this.mousePositionX;
    this.frameMousePositionY = this.mousePositionY;

    this.frameScrollWheel = this.scrollWheel;
    this.scrollWheel = 0;
  }

  //Get the values of different input states

  static getKey(key) {
    return this.keys[key];
  }
  static getKeyDown(key) {
    return this.frameKeysDown[key];
  }
  static down(key, lambda) {
    if (i.getKeyDown(key))
      lambda();
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
    return { x: this.frameMousePositionX, y: this.frameMousePositionY };
  }
  static getMousePositionDelta() {
    return { dx: this.frameMousePositionX - this.lastFrameMousePositionX, dy: this.frameMousePositionY - this.lastFrameMousePositionY };
  }


  static attach(document) {
    //Setup all the key listeners
    document.body.addEventListener('keydown', keydown);
    document.body.addEventListener('keyup', keyup);
    document.body.addEventListener('keypress', keypress);
    document.body.addEventListener('mousedown', mousedown);
    document.body.addEventListener('mouseup', mouseup);
    document.body.addEventListener('mousemove', mousemove);
    document.body.addEventListener('wheel', wheelevent);
    document.body.addEventListener('contextmenu', contextmenu);

    function keydown(event) {
      //console.log("Down: " + event.key);
      if (i.keys[event.key] != true)
        i.keysDown[event.key] = true;
      i.keys[event.key] = true;
    }

    function keyup(event) {
      //console.log("Up: " + event.key)
      if (i.keys[event.key] != false)
        i.keysUp[event.key] = true;
      i.keys[event.key] = false;
    }

    function mousedown(event) {
      //console.log("Mouse Down: " + event.button)
      if (i.mouseButtons["" + event.button] != true)
        i.mouseButtonsDown["" + event.button] = true;
      i.mouseButtons["" + event.button] = true;
    }

    function mouseup(event) {
      //console.log("Mouse Up: " + event.button)
      if (i.mouseButtons[event.button] != false)
        i.mouseButtonsUp[event.button] = true;
      i.mouseButtons[event.button] = false;
    }

    function mousemove(event) {
      //console.log("Mouse Move: " + event.clientX + ", " + event.clientY)
      i.mousePositionX = event.clientX;
      i.mousePositionY = event.clientY;
    }

    function wheelevent(event) {
      //console.log("Scroll Delta: " + event.deltaY)
      if (event.deltaY != 0)
        i.mouseScrollDelta = event.deltaY;
    }

    function keypress(event) {
      //console.log(`Keys: ${event.key}, Modifier keys: Control: ${event.ctrlKey}, Alt: ${event.altKey}, Shift: ${event.shiftKey}, Meta Key: ${event.metaKey}`);
    }

    // Based on https://stackoverflow.com/questions/381795/how-to-disable-right-click-context-menu-in-javascript
    // Kills the right mouse context menu
    function contextmenu(event) {
      if (event.preventDefault != undefined)
        event.preventDefault();
      if (event.stopPropagation != undefined)
        event.stopPropagation();
      return false;
    }
  }
}

initialBoot();