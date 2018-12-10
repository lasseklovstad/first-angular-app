importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if(workbox){
  workbox.setConfig({debug:true});
  console.log("WorkBox Works!")
  workbox.precaching.precacheAndRoute([]);

 // workbox.skipWaiting();
  workbox.clientsClaim();



  workbox.routing.registerRoute(
    new RegExp('https://api.entur.org/'),
    new workbox.strategies.NetworkFirst({
      cacheName:'runtime-cache',
      plugins:[new workbox.expiration.Plugin({
        maxEntries:1,
      })]
      }
    )
  );

}else{
  console.log("Workbox isn't supported")
}
