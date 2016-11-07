AFRAME.registerComponent('update-raycaster', {
  schema: {
    type: 'selector'
  },
  init: function () {
    var raycasterEl = this.data;
    this.data.components.raycaster.refreshObjects();
  }
});