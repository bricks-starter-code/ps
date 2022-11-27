/**
 * Usage:
 *
 * In a script tag, put in your custom code
 * After the your custom script, put in <script src="canvas.js"></script>
 *
 * If you have a function called customUpdate(), it will be called on the interval before any of the draw functions
 * If you have a function called customDraw(), it will be called after update on the same interval. customDraw() is called after centering 0,0 at the center of the screen
 * If you have a function called customUI(), it will be called after customDraw() in screen space
 *
 * If you set a variable called disableCameraMovement to something truthy, events will be ignored
 * If you set a variable called tickOnce to something truthy, the functions will only be called once.
 */


// Automatically add the canvas element to the DOM. This saves the user from
// having to add it manually, this keeping the html code to a minimum.
document.body.innerHTML += "<canvas id='canv' oncontextmenu='return false;'></canvas>";

// Add the link that sets the favicon, see https://gist.github.com/chrisyip/1403858
var link = document.createElement('link');
link.href = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="
link.rel = 'icon';
link.type = 'image/x-icon'; // no need for HTML5
document.getElementsByTagName('head')[0].appendChild(link); // for IE6

// Automatically generate the CSS for the page. This saves the user
// from having to include a CSS file or adding a style element to the head.
// These styles remove the margin around the canvas and remove scroll bars
document.body.style.setProperty('margin', '0px');
document.documentElement.style.setProperty('margin', '0px'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object
document.documentElement.style.setProperty('overflow', 'hidden'); //Apparently you can't do document.html...https://stackoverflow.com/questions/9362907/how-can-i-reference-the-html-elements-corresponding-dom-object

//Add the event hooks so we can respond to the mouse.
document.getElementById('canv').addEventListener('mousemove', mouseMove);
document.getElementById('canv').addEventListener('mousedown', mouseDown);
document.getElementById('canv').addEventListener('mouseup', mouseUp);
document.getElementById('canv').addEventListener('mousewheel', mouseWheel);

//Set the title programmatically
document.title = "PS";