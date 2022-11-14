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
 * If you set a variable called ignoreEvents to something truthy, events will be ignored
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
o.cameraZoom = 1;

//Set the default background color
o.fillColor = "lightgray"

//Set the frame rate
o.millisecondsBetweenFrames = 33
o.secondsBetweenFrames = 1 / o.millisecondsBetweenFrames

///Uncomment to disable mouse panning and zooming
//o.ignoreEvents = true;

//Uncomment if update should only be run once
//o.tickOne = true;

let c;
let canvas

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

///This gets called once when the page is completetly loaded.
///Think main()
function initialBoot() {

  canvas = document.getElementById("canv");   ///Get the canvas object
  c = canvas.getContext("2d");
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



  //Call the firstUpdate function if it exists (only called once)
  if (typeof firstUpdate === "function")
    firstUpdate(o);


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

  ///Make sure everything is the right size

  //Grab the size of the window
  o.width = window.innerWidth;
  o.height = window.innerHeight;

  //set the size of the canvas
  canvas.width = o.width;
  canvas.height = o.height;

  //If there is a custom update function, call it.
  if (typeof customUpdate === "function") {
    customUpdate(o);
  }

  drawCanvas();       ///Draw the canvas
}

///Called whenever the canvas needs to be redrawn
function drawCanvas() {
  ///Clear the rectangles
  c.fillStyle = o.fillColor;
  c.fillRect(0, 0, canvas.width, canvas.height);

  //Draw a grid in UI space before anythig else if the user
  //has requested it
  if (o.drawGrid) {

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
    step = Math.floor(step);
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
      c.fillText(x, tx + 20, 20);
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
      c.fillText((-y), 20, ty + 20);
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

  //Restore to pre-camera transform state
  c.restore();

  //Call customUI if the user has created this function
  if (typeof customUI === "function") {
    customUI(c, o);
  }
}


function mouseMove(e) {
  if (noEvents()) return;
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
  if (noEvents()) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;


  o.lastMouseX = e.clientX;
  o.lastMouseY = e.clientY;
  o.isMouseDown = true;
}

function mouseUp(e) {
  if (noEvents()) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;

  o.lastMouseX = e.clientX;
  o.lastMouseY = e.clientY;
  o.isMouseDown = false
}

function mouseWheel(e) {
  if (noEvents()) return;

  //Figure out the current world space coordinate
  let x = e.clientX - (o.width / 2 - o.cameraCenterX);
  let y = e.clientY - (o.height / 2 - o.cameraCenterY)
  x /= o.cameraZoom;
  y /= o.cameraZoom;
  //x -= (width/2 - o.cameraCenterX);
  //y -= (height/2 - o.cameraCenterY);

  if (e.wheelDelta > 0) {
    o.cameraZoom *= 1.1;
  }
  else if (e.wheelDelta < 0) {
    o.cameraZoom /= 1.1;
  }

  if (o.cameraZoom > 100) {
    o.cameraZoom = 100;
  }
  if (o.cameraZoom < .1) {
    o.cameraZoom = .1
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

function noEvents() {
  return (typeof o.ignoreEvents !== "undefined" && o.ignoreEvents)
}


initialBoot();
