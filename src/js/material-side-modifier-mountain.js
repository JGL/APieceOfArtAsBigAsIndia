AFRAME.registerComponent('material-side-modifier-mountain', {
  // This component can be used only once
  //multiple: true,
  // Allow material-side-modifier component a single property schema, of type int, defaulting to 2, aka THREE.DoubleSide, see https://threejs.org/docs/#Reference/Materials/Material.side
  schema: {
    side: {
      type:'int',
      default: 2
    }
  },
  tick: function(){
          //testing that I can print to the console
        //console.log("A-Frame and the rest have loaded");
        //Gaining access to the landscape element via it's ID
        var mountainEl = document.querySelector('#mountain');
        // Gaining access to the internal three.js object that the landscape component contains
        var mountainObject3D = mountainEl.object3D;
        //console.log(moutainObject3D.parent);
        //console.log(moutainObject3D.children);
        //See material properties here https://threejs.org/docs/#Reference/Materials/Material
        mountainObject3D.traverse( function( node ) {
          if( node.material ) { 
            node.material.side = THREE.DoubleSide; //just the back in this case to avoid glitches...
            node.material.needsUpdate = true;
          }
        });
  }, 
});