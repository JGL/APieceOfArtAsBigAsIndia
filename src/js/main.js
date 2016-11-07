require('aframe');
require('aframe-terrain-model-component');
var extras = require('aframe-extras');
// Register everything.
extras.registerAll();
require('aframe-mountain-component');
//requiring my first component! https://github.com/substack/browserify-handbook told me how to do this
require('./material-side-modifier.js');
//below are to complete the A-Frame docs component tutorial https://aframe.io/docs/0.3.0/guides/building-with-components.html
require('aframe-event-set-component');
require('aframe-template-component');
require('aframe-layout-component');
require('aframe-animation-component');
require('./update-raycaster.js');
require('./set-image.js');