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
| disableCameraMovement | Disables the mouse event system. If set to `true`, not mouse events will be captured, preventing the user from scrolling and panning with the mouse. | `false`/`undefined`. |
|tickOnce | If set to `true`, `customUpdate` will only be called once. The correct place to set this value is in the custom `firstUpdate` function. | `false`/`undefined`|