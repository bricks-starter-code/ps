let c;
let canvas

canvas = document.getElementById("canv");   ///Get the canvas object
c = canvas.getContext("2d");




// Create the options object and populate it with the defaults
let o = {};

function bootOptions() {

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

  //Disabled by default
  o.disableCameraMovement = false;
  o.tickOne = false;
  o.drawGrid = false;
  o.drawGridInFront = false; // True to draw the grid after everything else
}

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
  o.cameraZoom = z;
  return this;
}

bootOptions();