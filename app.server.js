// Modules
var express = require('express');

// Express
var app = express();

// our middleware
app.use(express.static('docs')); //Also GitHub Pages root, everything is going to be static to begin with

//Binding to a port...
app.listen(3000, function () {
  console.log('A piece of Art as big as India Express app listening on port 3000.');
});