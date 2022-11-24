# ps

A simple game loop written in pure JS and desigend to be highly customizable with out require significant amounts of coding.

# Why ps?



# Installation

You can include this library via https://cdn.jsdelivr.net/gh/bricksSeeds/ps/canvas.js or copy the minified version directly from the repo. 

# Usage

Include canvas.js in your .html file, and it will bootstrap a canvas and accompanying update() and draw() functions. It is left to the developer to only add a customUpdate() and customDraw() methods to have realtime (potentially interactive) visualization in a webpage. See index.html for an example of how to include ps.js and how to add the custom methods.

The `index.html` file in the root directory gives a skeleton for how the html side of things could work. More examples are found in the `examples` directory.

# Examples

The description of the examples is in the `examples` directiory

# More Documentation

- [Building](./doc/building.md)
- [Options](./doc/options.md)
- [Flow](./doc/flow.md)
