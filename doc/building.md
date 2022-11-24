# Building 

Begin by making sure you have `npm` installed. Then run `npm i` to install the required packages. The only package used is `uglify-js` and onl when minifying the `canvas.js` If you don't want to worry about minifying, you can skip installing `uglify-js`

Any time you make changes to the canvas.js file, you should run `npm run minify`. This builds the minified version at the root, copies the minified version to the `bin` directory, and copies the un-minified version into the `examples` folder.

You can also run `npm run minify` using `nodemon` if it is installed. To do this, run `npm run watch`.  This assumes you have `nodemon` install globally.