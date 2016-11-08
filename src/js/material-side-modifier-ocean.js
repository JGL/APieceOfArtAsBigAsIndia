AFRAME.registerComponent('material-side-modifier-ocean', {
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
        //Gaining access to the ocean element via it's ID
        var oceanEl = document.querySelector('#ocean');
        // Gaining access to the internal three.js object that the landscape component contains
        var oceanObject3D = oceanEl.object3D;
        //console.log(oceanObject3D.parent);
        //console.log(oceanObject3D.children);
        //See material properties here https://threejs.org/docs/#Reference/Materials/Material
        oceanObject3D.traverse( function( node ) {
          if( node.material ) {
            node.material.side = THREE.DoubleSide; //just the back in this case to avoid glitches...
            node.material.needsUpdate = true;
          }
        });
  }, 
});