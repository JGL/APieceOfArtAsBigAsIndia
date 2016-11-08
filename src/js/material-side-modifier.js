AFRAME.registerComponent('material-side-modifier', {
  // This component depends on the material component
  //dependencies: ['material'],
  // This component can be used multiple times
  multiple: true,
  // Allow material-side-modifier component a single property schema, of type int, defaulting to 2, aka THREE.DoubleSide, see https://threejs.org/docs/#Reference/Materials/Material.side
  schema: {
    side: {
      type:'int',
      default: 2
    }
  },
  update: function () {
  	console.log("Inside of update() of material-side-modifier");
    var side = this.data.side; //should be 2, the default value, all I want to be able to do is material.side = side; - change the side property of the material to
    var object3D = this.el.object3D;
    var mesh = this.el.getObject3D('mesh');
    mesh.material.side = THREE.DoubleSide;
  }
});

    // console.log("Starting traverse of object3D");
    // object3D.traverse( function( child ){
    //     console.log("Traversing...")
    //     console.log("The current child object is: ", child);
    //     if(child.material){
    //       child.material.side = THREE.DoubleSide;
    //     }
    //   }
    // );
    // console.log("Finished traverse of object3D");