AFRAME.registerComponent('collider-check-and-update', {
  dependencies: ['raycaster'],
  init: function () {
    var el = this.el; //tip from Don McCurdy, needed to store the element that this was called from
    this.el.addEventListener('raycaster-intersected', function () {
      //console.log('Player hit something!');
      //console.log(this); //where am I?
      //trying too call the update() method of the Mountain component to which this event listener is now attached
      //update(); //this errors with Uncaught ReferenceError: update is not defined
      //this.update(); //this doesn't error, but doesn't do anything
      //this.el.update(); //this errors with Cannot read property 'update' of undefined
      el.components['mountain'].update(); //tip from Don McCurdy
    });
  }
});