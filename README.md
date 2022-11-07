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