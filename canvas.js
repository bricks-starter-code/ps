document.body.innerHTML += "<canvas id='canv'></canvas>";

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
  canvas.width = 640;
  canvas.height = 480;

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
  ctx.fillStyle = "yellow";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if(typeof customDraw === "function"){
    customDraw(ctx);
  }

}

initialBoot();
