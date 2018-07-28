document.body.innerHTML += "<canvas id='canv'></canvas>";
document.body.style.setProperty('margin', '0px');
document.documentElement.style.setProperty('margin', '0px'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object

document.getElementById('canv').addEventListener('mousemove', mouseMove);
document.getElementById('canv').addEventListener('mousedown', mouseDown);
document.getElementById('canv').addEventListener('mouseup', mouseUp);


var width = 0;  //Will store the width of the canvas
var height = 0; //Will store the hegiht of the canvas

var cameraCenterX = 0; //The x position the camera is looking at
var cameraCenterY = 0; //The y position the camera is looking at

var isMouseDown = false; //True if the mouse is down

var lastMouseX = 0;
var lastMouseY = 0;

///This gets called once when the page is completetly loaded.
///Think main()
function initialBoot() {

  ///Update the model
  update();

  ///Start a timer
  timerID = setTimeout(tick, 33);    								///Initialize the timer
}

///This gets called evertime the timer ticks
function tick() {

  ///Respond differently based on the game state
  timerID = setTimeout(tick, 33);    ///Restart the timer

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

   if(typeof customUpdate === "function"){
    customUpdate();
  }

  drawCanvas();       ///Draw the canvas
}

///Called whenever the canvas needs to be redrawn
function drawCanvas() {

  ///Grab the canvas so we can draw on it
  var ctx = canvas.getContext("2d");      ///Get the canvas context

  ///Clear the rectangles
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.save();
  
  ctx.translate(width/2 - cameraCenterX, height/2 - cameraCenterY);
  
  

  if(typeof customDraw === "function"){
    customDraw(ctx);
  }
  
  ctx.restore();

}

function mouseMove(e){
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;
  
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function mouseDown(e){
  let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;
  
  if(isMouseDown){
    let diffX = currentMouseX - lastMouseX;
    let diffY = currentMouseY = lastMouseY;
    
    cameraX += diffX;
    cameraY += diffY;
  }
  
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  isMouseDown = true;
}

function mouseUp(e){
   let currentMouseX = e.clientX;
  let currentMouseY = e.clientY;
  
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  isMouseDown = false
}


initialBoot();
