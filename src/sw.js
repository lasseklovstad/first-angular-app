importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if(workbox){
  workbox.setConfig({debug:true});
  workbox.skipWaiting();
  workbox.clientsClaim();
  console.log("WorkBox Works!")
  workbox.precaching.precacheAndRoute([]);





  workbox.routing.registerRoute(
    new RegExp('https://api.entur.org/'),
    new workbox.strategies.StaleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    new RegExp('https://jsonplaceholder.typicode.com/posts'),
    new workbox.strategies.StaleWhileRevalidate()
  );

}else{
  console.log("Workbox isn't supported")
}
