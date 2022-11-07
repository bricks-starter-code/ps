# ps

A simple game loop written in pure JS and desigend to be highly customizable with out require significant amounts of coding.


# Usage

You can include this library via https://cdn.jsdelivr.net/gh/bricksSeeds/ps/canvas.js or copy the minified version directly from the repo. 

Include canvas.js in your .html file, and it will bootstrap a canvas and accompanying update() and draw() functions. It is left to the developer to only add a customUpdate() and customDraw() methods to have realtime (potentially interactive) visualization in a webpage. See index.html for an example of how to include ps.js and how to add the custom methods.

The `index.html` file in the root directory gives a skeleton for how the html side of things could work. More examples are found in the `examples` directory.


# Building

Begin by making sure you have `npm` installed. Then run `npm i` to install the required packages. The only package used is `uglify-js` and onl when minifying the `canvas.js` If you don't want to worry about minifying, you can skip installing `uglify-js`

Any time you make changes to the canvas.js file, you should run `npm run minify`. This builds the minified version at the root, copies the minified version to the `bin` directory, and copies the un-minified version into the `examples` folder.

You can also run `npm run minify` using `nodemon` if it is installed. To do this, run `npm run watch`.  This assumes you have `nodemon` install globally.

# Examples

The description of the examples is in the `examples` directiory

# Options

Each of the four possible custom functions receives a reference to the `options` variable. Changing certain values on the `options` variable affects how the engine runs and how the canvas is drawn. Other values should be considered read-only since they just provide constant information. Changing these values does not affect the engine.  The following table lists these values.

|Value | Explanation | Default/Read Only|
|---|---|---|
|width|The width of the canvas element. Should also be the width of the page itself. | Should be treated as read-only|
|height| The height of the canvas element. Should also be the height of the page itself.| Should be treated as read-only |
| cameraCenterX | The position in world space of the camera's x coordinate. | 0. Updating this value will move the virtual camera. |
|cameraCenterY | The position in world space of the camera's y coordinate. | 0. Updating this value will move the virtual camera.|
|isMouseDown| `true` if the mouse is down, `false` otherwise. | Should be treated as rea-only|
|lastMouseX| The world space position of the mouse's x coordinate.|Should be treated as read-only|
|lastMouseY|The world space position of the mouse's y coordinate. | Should be treated as read-only.
|cameraZoom | How the canvas is scaled to create the ability to zoom in and out. | 0. Changing this value will change the camera zoom.|
|fillColor| The color used to clear this canvas before anything is drawn. | `lightgray`. Changing this value will change the background color on the next frame.|
|millisecondsBetweenFrames. | The number of milliseconds sent to the timer. Except in the case when computation goes longer than this amount, this is the framerate in milliseconds. | This should be treated as read-only.|
|secondsBetweenFrames| Same as `millisecondsBetweenFrames`, but expressed as a decimal number of seconds. This value is the easiest one to use in `customUpdate` to track the passage of time. | This should be treated as read-only.
| ignoreEvents | Disables the mouse event system. If set to `true`, not mouse events will be captured, preventing the user from scrolling and panning with the mouse. | `false`/`undefined`. |
|tickOnce | If set to `true`, `customUpdate` will only be called once. The correct place to set this value is in the custom `firstUpdate` function. | `false`/`undefined`|

## Flow of the engine

After setting up the DOM, styles, options, and mouse events, `canvas.js` calls `initialBoot`. This is called only once and is the first function called. First, this functions checks if there is a `firstUpdate` function provided by the user. This function is designed for the user to set values on the `options` variable before the game loop starts. After checkking for `firstUpdate` and calling it if it exists, `initialBoot` then called the internal `update` function.

 `update` sets the canvas to be the size of the webpage and then calls `customUpdate` if it exists. This is a chance for the user to update state before drawing. After `customUpdate`, then `drawCanvas`is called. 

`drawCanvas` clears the canvas with the fill color specified in `options`, saves the state of the transform stack, applies translation and scaling to reflection the position and zoom of the camera, and then calls `customDraw` if it exists.  `customDraw` is where all drawing should take place.

If the `tickOnce` option is defined and true, the the internal `tick` command is not called and there will be non more updates. If not, a repeating timer is set which calls `tick` repeatedly. 

`tick` stores the current time and then calls `update` and `drawCanvas` as explained.



