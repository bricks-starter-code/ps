$$ = {}

$$.b = function () {
  c.beginPath();
  return this;
}
$$.m = function (x, y) {
  c.moveTo(x, y)
  return this;
}
$$.l = function (x, y) {
  c.lineTo(x, y);
  return this;
}
$$.s = function () {
  c.stroke();
  return this;
}
$$.f = function () {
  c.fill();
  return this;
}
$$.st = function (style) {
  c.strokeStyle = style;
  return this;
}
$$.fi = function (style) {
  c.fillStyle = style;
  return this;
}
$$.fo = function (font) {
  c.font = font
  return this;
}
$$.text = function (text, x, y) {
  c.fillText(text, x, y);
  return this;
}
$$.tc = function (t, x, y) {//Draw text centered
  let mt = c.measureText(t)
  this.text(t, x - mt.width / 2, y - mt.fontBoundingBoxAscent / 2)
  return this
}
$$.circle = function (x, y, r) {
  c.arc(x, y, r, 0, Math.PI * 2)
  return this;
}
$$.fillRectCentered = function (x, y, rx, ry) {
  c.fillRect(x - rx, y - ry, rx * 2, ry * 2);
  return this;
}