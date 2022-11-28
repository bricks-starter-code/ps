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

function findGameObject(name){
  if(!cs()) return null
  if(!cs().gameObjects) return null;
  //Implied else
  return cs().gameObjects.find(go=>go.started && go.name == name);
}

function getGameObjects(){
  if(!cs())return null;
  return cs().gameObjects
}


///This gets called once when the page is completetly loaded.
///Think main()
function initialBoot() {

  i.attach(document) //Start the input handling

  ///Make sure everything is the right size
  resizeCanvas();

  //Call the firstUpdate function if it exists (only called once)
  if (typeof firstUpdate === "function") {
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

  //Update the global model
  update();

  //Draw the global model
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
  if (cs().gameObjects) {
    cs().gameObjects.forEach(go => {
      if (!go.started) {
        if (typeof go.start == "function")
          go.start(c, o);
        go.started = true;
      }
    })
    cs().gameObjects.forEach(go => {
      if (typeof go.update === "function")
        go.update(c, o);
    });
  }
  if (typeof cs()?.customUpdate === "function") cs().customUpdate(c, o)


  drawCanvas();       ///Draw the canvas
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
  if (cs().gameObjects) {
    cs().gameObjects.forEach(go =>{ 
      if(typeof go.draw === "function")
      go.draw(c, o);
    })
  }
  if (typeof cs()?.customDraw === "function") cs().customDraw(c, o)


  //Restore to pre-camera transform state
  c.restore();

  if (o.drawGrid && o.drawGridInFront)
    drawTheGrid()

  //Call customUI if the user has created this function
  if (typeof cs()?.customUI === "function") cs().customUI(c, o)
}


