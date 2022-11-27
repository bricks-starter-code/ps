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
    
    $$.st("black").line(tx-1,ty,tx-1,t2)
    
    c.strokeStyle = "white";
    if (x == 0)
      c.strokeStyle = "green"
    c.beginPath()
    c.moveTo(tx, ty);
    c.lineTo(tx, t2)
    c.stroke()

    c.fillStyle = "white"
    c.fillText(x.toFixed(2), tx + 20, 20);
    c.fillStyle = "black"
    c.fillText(x.toFixed(2), tx + 20-1, 20-1);
  }
  for (let y = startY; y <= stopY; y += step) {
    let tx, ty, tx2;
    [tx, ty] = o.toScreenSpace(startX, y);
    [tx2, ty] = o.toScreenSpace(stopX, y);

    $$.st("black").line(tx,ty-1,tx2,ty-1)
    c.strokeStyle = "white";
    if (y == 0)
      c.strokeStyle = "red"
    c.beginPath()
    c.moveTo(tx, ty);
    c.lineTo(tx2, ty)
    c.stroke()

    c.fillStyle = "white"
    c.fillText((-y).toFixed(2), 20, ty + 20);
    c.fillStyle = "black"
    c.fillText((-y).toFixed(2), 20-1, ty + 20-1);
  }
}