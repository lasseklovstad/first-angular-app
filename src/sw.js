importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if(workbox){
  console.log("WorkBox Works!")
  workbox.precaching.precacheAndRoute([]);
  workbox.core.setLogLevel(workbox.core.LOG_LEVELS.debug);
  workbox.skipWaiting();
  workbox.clientsClaim();

  const handlerCb = ({url,event,params})=>{
    console.log("handle post request")
    return fetch(event.request)
      .then((response) => {
        return response;
      }).then((res)=>{
        caches.open('runtime-cache').then((cache)=>{
          console.log("open cache")

          cache.put(url,res).then(()=>{
            console.log("added to cache")
          })
        })
      })
      .catch(err=>{
        console.log("fecth:",err)
      })

  }

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
  workbox.routing.registerRoute(
    new RegExp('https://api.entur.org/journeyplanner/'),
    handlerCb,
    'POST'
  );
}else{
  console.log("Workbox isn't supported")
}
