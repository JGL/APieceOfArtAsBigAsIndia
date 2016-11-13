require('aframe');
require('aframe-mountain-component');
//second interaction demo, working with the Mountain component instead
require('./material-side-modifier-mountain.js');
//starting up touch and click events and random functions
//require('./touchEventsAndClickEventsAndRandomColours.js'); //folded in individually now...
//click and drag
var clickdrag = require('./clickdrag.js');
clickdrag.default(AFRAME);