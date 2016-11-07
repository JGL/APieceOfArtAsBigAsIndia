AFRAME.registerComponent('single-property-schema-bug', {
  // This component can be used multiple times
  multiple: true,
  // Allow material-side-modifier component a single property schema, of type int, defaulting to 2
  schema: { default: 2 },
  init: function () {
  	console.log("Inside of init() of single-property-schema-bug");
    var side = this.data; //should be 2, the default value
    console.log("The value of this.data is ", this.data); //why isn't this reporting properly?
    console.log("The value of var side is ", side); //why isn't this reporting properly?
  }
});