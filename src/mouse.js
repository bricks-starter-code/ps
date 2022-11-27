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


