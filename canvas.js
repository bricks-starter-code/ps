/**
 * Usage:
 * 
 * In a script tag, put in your custom cade
 * After the your custom script, put in <script src="canvas.js"></script>
 * 
 * If you have a function called customUpdate(), it will be called on the interval before any of the draw functions
 * If you have a function called customDraw(), it will be called after update on the same interval. customDraw() is called after centering 0,0 at the center of the screen
 * If you have a function called customUI(), it will be called after customDraw() in screen space
 * 
 * If you set a variable called ignoreEvents to something truthy, events will be ignored
 * If you set a variable called tickOnce to something truthy, the functions will only be called once.
 */



document.body.innerHTML += "<canvas id='canv'></canvas>";
document.body.style.setProperty('margin', '0px');
document.documentElement.style.setProperty('margin', '0px'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object
document.documentElement.style.setProperty('overflow', 'hidden'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object

document.getElementById('canv').addEventListener('mousemove', mouseMove);
document.getElementById('canv').addEventListener('mousedown', mouseDown);
document.getElementById('canv').addEventListener('mouseup', mouseUp);
document.getElementById('canv').addEventListener('mousewheel', mouseWheel);


var width = 0;  //Will store the width of the canvas
var height = 0; //Will store the hegiht of the canvas

var cameraCenterX = 0; //The x position the camera is looking at
var cameraCenterY = 0; //The y position the camera is looking at

var isMouseDown = false; //True if the mouse is down

var lastMouseX = 0;
var lastMouseY = 0;

var cameraZoom = 1;

///This gets called once when the page is completetly loaded.
///Think main()
function initialBoot() {

  ///Update the model
  update();

  ///Start a timer
  if (typeof tickOnce === 'undefined' || !tickOnce)
    timeID = setInterval(tick, 33)
  else
    timerID = setTimeout(tick, 33);    								///Initialize the timer
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

  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  if (typeof customUpdate === "function") {
    customUpdate();
  }

  drawCanvas();       ///Draw the canvas
}

///Called whenever the canvas needs to be redrawn
function drawCanvas() {

  ///Grab the canvas so we can draw on it
  var ctx = canvas.getContext("2d");      ///Get the canvas context

  ///Clear the rectangles
  ctx.fillStyle = "lightgray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.translate(width / 2 - cameraCenterX, height / 2 - cameraCenterY);
  ctx.scale(cameraZoom, cameraZoom);



  if (typeof customDraw === "function") {
    customDraw(ctx);
  }

  ctx.restore();

  if (typeof customUI === "function") {
    customUI(ctx);
  }

}



function mouseMove(e) {
  if (ignoreEvents) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;

  if (isMouseDown) {
    let diffX = currentMouseX - lastMouseX;
    let diffY = currentMouseY - lastMouseY;

    cameraCenterX -= diffX;
    cameraCenterY -= diffY;
  }
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function mouseDown(e) {
  if (ignoreEvents) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;


  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  isMouseDown = true;
}

function mouseUp(e) {
  if (ignoreEvents) return;
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;

  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  isMouseDown = false
}

function mouseWheel(e) {
  if (ignoreEvents) return;

  //Figure out the current world space coordinate
  let x = e.clientX - (width / 2 - cameraCenterX);
  let y = e.clientY - (height / 2 - cameraCenterY)
  x /= cameraZoom;
  y /= cameraZoom;
  //x -= (width/2 - cameraCenterX);
  //y -= (height/2 - cameraCenterY);

  if (e.wheelDelta > 0) {
    cameraZoom *= 1.1;
  }
  else if (e.wheelDelta < 0) {
    cameraZoom /= 1.1;
  }

  //Now figure out what the new world space coordinate has changed to

  let x2 = e.clientX - (width / 2 - cameraCenterX);
  let y2 = e.clientY - (height / 2 - cameraCenterY);
  x2 /= cameraZoom;
  y2 /= cameraZoom;
  //x2 -= (width/2 - cameraCenterX);
  //y2 -= (height/2 - cameraCenterY);

  cameraCenterX -= x2 - x;
  cameraCenterY -= y2 - y;
}


initialBoot();
