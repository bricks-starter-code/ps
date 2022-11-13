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
let options = {};

options.width = 0;  //Will store the width of the canvas
options.height = 0; //Will store the hegiht of the canvas

options.cameraCenterX = 0; //The x position the camera is looking at
options.cameraCenterY = 0; //The y position the camera is looking at

options.isMouseDown = false; //True if the mouse is down

//Helper variables for tracking mouse movement
options.lastMouseX = 0;
options.lastMouseY = 0;

//Set the default camera zoom
options.cameraZoom = 1;

//Set the default background color
options.fillColor = "lightgray"

//Set the frame rate
options.millisecondsBetweenFrames = 33
options.secondsBetweenFrames = 1 / options.millisecondsBetweenFrames

///Uncomment to disable mouse panning and zooming
//options.ignoreEvents = true;

//Uncomment if update should only be run once
//options.tickOne = true;

options.toWorldSpace = function (screenX, screenY) {
  let x = screenX - (options.width / 2 - options.cameraCenterX);
  let y = screenY - (options.height / 2 - options.cameraCenterY)
  x /= options.cameraZoom;
  y /= options.cameraZoom;
  return [x, y]
}

options.toScreenSpace = function (worldX, worldY) {
  let x = worldX * options.cameraZoom;
  let y = worldY * options.cameraZoom;
  x += (options.width / 2 - options.cameraCenterX);
  y += (options.height / 2 - options.cameraCenterY);
  return [x, y];
}

///This gets called once when the page is completetly loaded.
///Think main()
function initialBoot() {

  //Call the firstUpdate function if it exists (only called once)
  if (typeof firstUpdate === "function")
    firstUpdate(options);


  ///Start a timer
  if (typeof options.tickOnce !== 'undefined' && options.tickOnce)
    //setTimeout(tick, options.millisecondsBetweenFrames)
    console.log("Ticking only once.")
  else {
    ///Update the model
    //update(options);
    setInterval(tick, options.millisecondsBetweenFrames);    								///Initialize the timer
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
  canvas = document.getElementById("canv");   ///Get the canvas object

  options.width = window.innerWidth;
  options.height = window.innerHeight;

  canvas.width = options.width;
  canvas.height = options.height;

  if (typeof customUpdate === "function") {
    customUpdate(options);
  }

  drawCanvas();       ///Draw the canvas
}

///Called whenever the canvas needs to be redrawn
function drawCanvas() {

  ///Grab the canvas so we can draw on it
  var ctx = canvas.getContext("2d");      ///Get the canvas context

  ///Clear the rectangles
  ctx.fillStyle = options.fillColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //Draw a grid in UI space before anythig else if the user
  //has requested it
  if (options.drawGrid) {

    //The coordinates of the upper left (ul) and lower right (lr) coordinates
    let ulx, uly;
    [ulx, uly] = options.toWorldSpace(0, 0)
    let lrx, lry;
    [lrx, lry] = options.toWorldSpace(ctx.canvas.width, ctx.canvas.height)
    
    let startX, startY, stopX, stopY;

    let base = 10;
    let min = Math.min(lrx - ulx, lry - uly);
    let step = Math.log10(min)/Math.log10(base);
    step = Math.floor(step);
    step = Math.pow(base, step);

    startX = parseInt((ulx-step) / step) * step
    stopX = lrx
    startY = parseInt((uly-step) / step) * step
    stopY = lry;

    for (let x = startX; x <= stopX; x += step) {
      let tx, ty, t2;
      [tx, ty] = options.toScreenSpace(x, startY);
      [tx, t2] = options.toScreenSpace(x, stopY);
      ctx.strokeStyle = "gray";
      ctx.beginPath()
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx, t2)
      ctx.stroke()

      ctx.fillStyle = "white"
      ctx.fillText(x, tx + 20, 20);
    }

    for (let y = startY; y <= stopY; y += step) {
      let tx, ty, tx2;
      [tx, ty] = options.toScreenSpace(startX, y);
      [tx2, ty] = options.toScreenSpace(stopX, y);
      ctx.strokeStyle = "gray";
      ctx.beginPath()
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx2, ty)
      ctx.stroke()

      ctx.fillStyle = "white"
      ctx.fillText(y, 20, ty + 20);
    }


  }


  ctx.save();

  ctx.translate(options.width / 2 - options.cameraCenterX, options.height / 2 - options.cameraCenterY);
  ctx.scale(options.cameraZoom, -options.cameraZoom);



  if (typeof customDraw === "function") {
    customDraw(ctx, options);
  }

  ctx.restore();






  //Call customUI if the user has created this function
  if (typeof customUI === "function") {
    customUI(ctx, options);
  }

}


function mouseMove(e) {
  if (noEvents()) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;

  if (options.isMouseDown) {
    let diffX = currentMouseX - options.lastMouseX;
    let diffY = currentMouseY - options.lastMouseY;

    options.cameraCenterX -= diffX;
    options.cameraCenterY -= diffY;
  }
  options.lastMouseX = e.clientX;
  options.lastMouseY = e.clientY;
}

function mouseDown(e) {
  if (noEvents()) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;


  options.lastMouseX = e.clientX;
  options.lastMouseY = e.clientY;
  options.isMouseDown = true;
}

function mouseUp(e) {
  if (noEvents()) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;

  options.lastMouseX = e.clientX;
  options.lastMouseY = e.clientY;
  options.isMouseDown = false
}

function mouseWheel(e) {
  if (noEvents()) return;

  //Figure out the current world space coordinate
  let x = e.clientX - (options.width / 2 - options.cameraCenterX);
  let y = e.clientY - (options.height / 2 - options.cameraCenterY)
  x /= options.cameraZoom;
  y /= options.cameraZoom;
  //x -= (width/2 - options.cameraCenterX);
  //y -= (height/2 - options.cameraCenterY);

  if (e.wheelDelta > 0) {
    options.cameraZoom *= 1.1;
  }
  else if (e.wheelDelta < 0) {
    options.cameraZoom /= 1.1;
  }

  if (options.cameraZoom > 10) {
    options.cameraZoom = 10;
  }
  if (options.cameraZoom < .1) {
    options.cameraZoom = .1
  }

  //Now figure out what the new world space coordinate has changed to

  let x2 = e.clientX - (options.width / 2 - options.cameraCenterX);
  let y2 = e.clientY - (options.height / 2 - options.cameraCenterY);
  x2 /= options.cameraZoom;
  y2 /= options.cameraZoom;
  //x2 -= (width/2 - options.cameraCenterX);
  //y2 -= (height/2 - options.cameraCenterY);

  options.cameraCenterX -= x2 - x;
  options.cameraCenterY -= y2 - y;
}

function noEvents() {
  return (typeof options.ignoreEvents !== "undefined" && options.ignoreEvents)
}


initialBoot();
