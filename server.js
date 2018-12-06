//Install express server
const express = require('express');
const path = require('path');







if(process.env.NODE_ENV=='production'){
  console.log("Enforce https");
  const enforce = require('express-sslify');
}else{
  console.log("Do not enforce http");
}


const app = express();
//app.use(enforce.HTTPS({trustProtoHeader:true}));

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/my-first-angular'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname + '/dist/my-first-angular/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8081);
