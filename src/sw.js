importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js');

if(workbox){
  console.log("WorkBox Works!")
  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerRoute(
    new RegExp('https://api.entur.org/'),
    workbox.strategies.networkFirst({
      cacheName:'runtime-cache',
      plugins:[new workbox.expiration.Plugin({
        maxAgeSeconds: 24 * 60 * 60,
      })]
      }
    )
  );
}else{
  console.log("Workbox isn't supported")
}
