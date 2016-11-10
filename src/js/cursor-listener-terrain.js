// Component to change to random colour on click, not functioning presently
AFRAME.registerComponent('cursor-listener-terrain', {
  init: function () {
    this.el.addEventListener('click', function () {
    	console.log('I was clicked!');
	    if(this.el.getObject3D('terrain')){
	    	var COLOURS = ['red', 'green', 'blue'];
	    	var randomIndex = Math.floor(Math.random() * COLOURS.length);
	    	//this.setAttribute('material', 'color', COLOURS[randomIndex]);
	    	var terrain = this.el.getObject3D('terrain');
	    	terrain.material.color = COLOURS[randomIndex];
	    	console.log('I changed the colour!');
	    }
    });
  }
});