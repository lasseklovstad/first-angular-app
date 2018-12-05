//Install express server
const express = require('express');
const path = require('path');
const workboxBuild = require('workbox-build');

workboxBuild.generateSW({
  swDest: './dist/my-first-angular/sw.js',
  globDirectory: './dist/my-first-angular',
  globPatterns: ['**/*.{html,js,css,ico}'],
  runtimeCaching: [{
    urlPattern: new RegExp('https://api.entur.org/'),
    handler: 'staleWhileRevalidate',
    
  }]
}).then(() => {
  console.log("Generated Service worker")
}).catch(err => {
  console.log("Failed to generate Service worker", err)
})

//const enforce = require('express-sslify');

const app = express();
//app.use(enforce.HTTPS({trustProtoHeader:true}));

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/my-first-angular'));

app.get('/*', function (req, res) {

  res.sendFile(path.join(__dirname + '/dist/my-first-angular/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8081);
