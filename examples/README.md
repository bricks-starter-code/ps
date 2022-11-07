# Examples

This directory contains a series of examples that all use the `canvas.js` javascript file.

All the examples call `canvas.js` using a relative call, e.g. `"./canvas.js"`, but these can be replaced with CDN calls, e.g. https://cdn.jsdelivr.net/gh/bricksSeeds/ps/canvas

## Print Once

`print_once.html` has the engine tick only one time. It adds a hook to the tick using `firstUpdate` and prints to the command line.

## Draw Animation Random

`draw_animation_random.html` is a stateless webpage that uses the `customDraw` fuction to draw a square on the canvas. The color is chosen randomly with each tick of the engine.

# Draw Animation Smooth

`draw_animation_smooth.html` adds state to the font-end. A variable `t` tracks how much time has passed in the `customUpdate` function. This is then used to draw a square that smoothly transitions though colors based on `t`.

# Draw Animation GUI

`draw_animation_gui.html` is similar to `draw_animation_smooth.html` except that is draws the value of `t` in screen space using the `customUI` function.