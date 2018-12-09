importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if(workbox){
  console.log("WorkBox Works!")
  workbox.precaching.precacheAndRoute([]);
  workbox.setConfig({debug:true});
  workbox.skipWaiting();
  workbox.clientsClaim();



  workbox.routing.registerRoute(
    new RegExp('https://api.entur.org/'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName:'runtime-cache',
      plugins:[new workbox.expiration.Plugin({
        maxEntries:2,
      })]
      }
    )
  );

}else{
  console.log("Workbox isn't supported")
}
