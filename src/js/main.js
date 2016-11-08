require('aframe');
require('aframe-terrain-model-component');
var extras = require('aframe-extras');
// Register everything.
extras.registerAll();
require('aframe-mountain-component');
//requiring my first component! https://github.com/substack/browserify-handbook told me how to do this
require('./material-side-modifier.js'); //added to make sure old demo's keep working
require('./material-side-modifier-terrain-model.js');
//below are to complete the A-Frame docs component tutorial https://aframe.io/docs/0.3.0/guides/building-with-components.html
require('aframe-event-set-component');
require('aframe-template-component');
require('aframe-layout-component');
require('aframe-animation-component');
require('./update-raycaster.js');
require('./set-image.js');
//making the bug re-appear for the issue I'm filling with A-Frame github
require('./single-property-schema-bug.js');
//first interaction demo, not working properly, using the Cursor documentation: https://aframe.io/docs/0.3.0/components/cursor.html
require('./cursor-listener-terrain.js');
//second interaction demo, working with the Mountain component instead
require('./material-side-modifier-mountain.js');
require('./cursor-listener.js');
//third interaction demo, working with the Ocean component instead, not functioning
require('./material-side-modifier-ocean.js');
//using the Raycaster cocumentation, adding a collider-check component: https://aframe.io/docs/0.3.0/components/raycaster.html
require('./collider-check.js');
//now trying to run the update() method of an attached component using the collider to attach
require('./collider-check-and-update.js');