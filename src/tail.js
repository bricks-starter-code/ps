function collisionRectRect(cx, cy, rx, ry, cx1, cy1, rx1, ry1) {
  const collision = !(cx - rx > cx1 + rx1 || cx + rx < cx1 - rx1 || cy - rx > cy1 + ry1 || cy + ry < cy1 - ry1)
  return collision;
}

function inc(current, change, max, ifTrue, ifFalse){
  let toReturn = current + change;
  if(toReturn >= max){
    if(ifTrue){
      ifTrue()
    }
    return 0;
  }
  else{
    if(ifFalse){
      ifFalse()
    }
    return toReturn
  }
}

function interp(percent, start, end){
  return (1-percent)*start + percent*end
}

initialBoot();