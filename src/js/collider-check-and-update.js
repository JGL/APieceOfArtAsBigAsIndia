AFRAME.registerComponent('collider-check-and-update', {
  dependencies: ['raycaster'],
  init: function () {
    var el = this.el; //tip from Don McCurdy, needed to store the element that this was called from
    this.el.addEventListener('raycaster-intersected', function () {
      el.components['mountain'].update(); //tip from Don McCurdy
      el.components['mountain'].color = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';
      //the above doesn't work... why?
    });
  }
});