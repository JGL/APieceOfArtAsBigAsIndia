// Component to change to random colour on click.
AFRAME.registerComponent('cursor-listener', {
  init: function () {
  	console.log("cursor-listener.js init begin");
    this.el.addEventListener('click', function () {
      console.log('I was clicked!');
    	var COLORS = ['red', 'green', 'blue'];
    	var randomIndex = Math.floor(Math.random() * COLORS.length);
    	this.setAttribute('material', 'color', COLORS[randomIndex]);
    });
    console.log("cursor-listener.js init end");
  }
});