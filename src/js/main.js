require('aframe');
require('aframe-terrain-model-component');
var extras = require('aframe-extras');
// Register everything.
extras.registerAll();
require('aframe-mountain-component');
require('kframe');
//requiring my first component! https://github.com/substack/browserify-handbook told me how to do this
require('./material-side-modifier.js');