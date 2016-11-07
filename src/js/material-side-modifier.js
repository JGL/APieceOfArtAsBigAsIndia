AFRAME.registerComponent('material-side-modifier', {
  // This component can be used multiple times
  multiple: true,
  // Allow material-side-modifier component a single property schema, of type int, defaulting to 2
  schema: { default: 2 },
  init: function () {
  	console.log("Inside of init() of material-side-modifier");
    var side = this.data; //should be 2, the default value
    console.log("The value of this.data is ", this.data); //why isn't this reporting properly?
    console.log("The value of var side is ", side); //why isn't this reporting properly?
  }
});

/*


    //now object3D logging
    var object3D = this.el.object3D;
    console.log("Object3D is ", object3D);

    // Update the side property of the material of the component to 2 aka THREE.DoubleSide, see: https://threejs.org/docs/#Reference/Materials/Material

    //this works when typed into console, but not here programmatically, found here: https://threejs.org/docs/#Reference/Materials/Material
    console.log("(Method 1: The current number of sides is", object3D.children[i].material.side);
    object3D.children[0].material.side = THREE.DoubleSide;
    console.log("Method 1: The updated number of sides is", object3D.children[i].material.side);

    //via http://stackoverflow.com/questions/18613295/how-to-set-a-texture-on-a-object3d-child-mesh
    console.log("object3D has: ", object3D.children, " children.");
    for(var i in object3D.children) {
        //for all the children of the landscapeObject3D, change the material side property to THREE.DoubleSide aka 2
        console.log("(Method 2: The current number of sides is", object3D.children[i].material.side);
        object3D.children[i].material.side = THREE.DoubleSide;
        console.log("Method 2: The updated number of sides is", object3D.children[i].material.side);
      }
    // via: http://stackoverflow.com/questions/16027131/three-js-how-to-make-double-sided-object
    object3D.traverse( function( node ) {
      console.log("Traversing...");
      if( node.material ) {
        console.log("Method 3: The current number of sides is",node.material.side);
        node.material.side = THREE.DoubleSide;
        node.material.needsUpdate = true;
        console.log("Method 3: The updated number of sides is",node.material.side);
      }
    })
  }
*/