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
  o.cameraZoom = z;
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

function cs() {
  if (!o.scenes) return null
  return o.scenes[o.currentScene];
}

function isFunc(reference) {
  return typeof reference === "function"

}

///This gets called once when the page is completetly loaded.
///Think main()
function initialBoot() {

  i.attach(document) //Start the input handling

  ///Make sure everything is the right size
  resizeCanvas();

  //Call the firstUpdate function if it exists (only called once)
  if(typeof firstUpdate === "function"){
    firstUpdate(c, o)
  }

  if (o.scenes) { //Bootstrap the scene architecture as needed
    o.currentScene = 0;
    o.sceneChange = false;
    o.changeScene = function (index) {
      o.newSceneIndex = index;
      o.sceneChange = true;
      bootOptions()
    }
    typeof cs().firstUpdate === "function" ? cs().firstUpdate(c, o) : {}
    
  }

  ///Start a timer
  if (!(typeof o.tickOnce !== 'undefined' && o.tickOnce))
    setInterval(tick, o.millisecondsBetweenFrames);///Initialize the timer
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

  if (o?.sceneChange) {
    o.sceneChange = false;
    o.currentScene = o.newSceneIndex;
    if (typeof cs()?.firstUpdate === "function") cs().firstUpdate(c, o)
  }

  //If there is a custom update function, call it.
  if (typeof customUpdate === "function") {
    customUpdate(c, o);
  }
  if (typeof cs()?.customUpdate === "function") cs().customUpdate(c, o)


  drawCanvas();       ///Draw the canvas
}

function drawTheGrid() {
  //Draw a grid in UI space before anythig else if the user
  //has requested it

  $$.fo("10px Arial").fi("white")


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

///Called whenever the canvas needs to be redrawn
function drawCanvas() {
  //Update the canvas size in case there has been a change
  resizeCanvas()

  ///Clear the rectangles
  c.fillStyle = o.fillColor;
  c.fillRect(0, 0, canvas.width, canvas.height);

  if (o.drawGrid && !o.drawGridInFront)
    drawTheGrid()


  //Save transform before we account for the camera
  c.save();

  //Adjust for the camera
  c.translate(o.width / 2 - o.cameraCenterX, o.height / 2 - o.cameraCenterY);
  c.scale(o.cameraZoom, -o.cameraZoom);

  if (typeof customDraw === "function") {
    customDraw(c, o);
  }
  if (typeof cs()?.customDraw === "function") cs().customDraw(c, o)


  //Restore to pre-camera transform state
  c.restore();

  if (o.drawGrid && o.drawGridInFront)
    drawTheGrid()

  //Call customUI if the user has created this function
  if (typeof cs()?.customUI === "function") cs().customUI(c, o)
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

  o.cameraCenterX -= x2 - x;
  o.cameraCenterY -= y2 - y;
}

function isCameraDisabled() {
  return (typeof o.disableCameraMovement !== "undefined" && o.disableCameraMovement)
}


