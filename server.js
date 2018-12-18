//Install express server
const express = require('express');
const path = require('path');
const enforce = require('express-sslify');
const bodyParser = require('body-parser');






let toggle = true;
let images = [];

const app = express();
app.use(bodyParser.json());
//app.use(enforce.HTTPS({trustProtoHeader:true}));
if(process.env.NODE_ENV=='production'){
  app.use(enforce.HTTPS({ trustProtoHeader: true }))


}else{
  console.log("Do not enforce http");
}

app.put('/image',(req,res)=>{
  images.push(req.body.image);
  res.status(200).end();
})

app.get('/image',(req,res)=>{
  res.status(200).send(images);
})


app.put('/toggle',(req,res)=>{
  toggle=!toggle;
  res.status(200).send(toggle);
})
app.get('/toggle',(req,res)=>{
  res.status(200).send(toggle);
})

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/my-first-angular'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname + '/dist/my-first-angular/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8081);
