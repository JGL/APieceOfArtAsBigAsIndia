AFRAME.registerComponent('material-side-modifier', {
  // This component can be used multiple times
  multiple: true,
  // Allow material-side-modifier component a single property schema, of type int, defaulting to 2
  schema: {
    side: {
      type:'int',
      default: 2
    }
  },
  update: function () {
  	console.log("Inside of update() of material-side-modifier");
    var side = this.data.side; //should be 2, the default value
    var object3D = this.el.object3D;

    console.log("Starting traverse of object3D");
    object3D.traverse( function( child ){
        console.log("Traversing...")
        console.log("The type of the child is", typeof child);
        if ( child instanceof THREE.Mesh ) {
          console.log("Found a THREE.Mesh!")
        }
      }
    );
    console.log("Finished traverse of object3D");
  }
});

//want to edit node.material.side = side;