importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');



// Safari on IOS 21.12.2018 do not support Blobs in IDB (indexedDB). A work around has been created for iOS:
// Use PouchDB to manage IDB and store the requestbody as arraybuffers instead of Blobs.
// When blobs are supported on iOS this should be removed
// Should we use another library for IDB??
const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);//&& !window.MSStream;
if(iOS){
  importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')
  const db = new PouchDB('todos');
}


if (workbox) {
  workbox.setConfig({debug: true});
  workbox.skipWaiting();
  workbox.clientsClaim();
  workbox.precaching.precacheAndRoute([]);


  workbox.routing.registerRoute(
    new RegExp('https://api.entur.org/'),
    new workbox.strategies.StaleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    new RegExp('/image'),
    new workbox.strategies.NetworkFirst(),
    'GET'
  );
  workbox.routing.registerRoute(
    new RegExp('/toggle'),
    new workbox.strategies.NetworkFirst(),
    'GET'
  );


// IOS Safari workaround
if(iOS){
  self.addEventListener('message',(event)=>{

    // Get all stored requests in IDB
    db.allDocs({include_docs:true,descending:true},(err,doc)=>{
      for(let row of doc.rows){
        // If the request object exists in the DB row
        if(row.doc.storableRequest){
          let  storableRequest= row.doc.storableRequest;
          // convert storableRequest object to Request
          let request = new StorableRequest(storableRequest.url,storableRequest.requestInit).toRequest();

          fetch(request).then(()=>{
            console.log("Replay succes");
            db.remove(row.doc);
          }).catch((err)=>{
            console.log("Replay Fail")
          })
        }



      }

      db.viewCleanup();
      db.compact().then(()=>{
        console.log("Cleaned up IDB")
      }).catch(()=>{
        console.log("Failed to clean IDB")
      })
    })

  })

  workbox.routing.registerRoute(
    new RegExp('/toggle'),
    new workbox.strategies.NetworkOnly({
      plugins: [
        {
          fetchDidFail: async ({originalRequest, request, error, event}) => {
            // No return expected.
            // NOTE: `originalRequest` is the browser's request, `request` is the
            // request after being passed through plugins with
            // `requestWillFetch` callbacks, and `error` is the exception that caused
            // the underlying `fetch()` to fail.
            let storableRequest = await StorableRequest.fromRequest(request);

            let todo = {
              _id: new Date().toISOString(),
              storableRequest: storableRequest.toObject(),
            }
            db.put(todo, function callback(err, result) {
              if (!err) {
                console.log('Saved failed request in IDB');
              }
            });

          }
        }

      ]
    }),
    'PUT'
  );


  workbox.routing.registerRoute(
    new RegExp('/image'),
    new workbox.strategies.NetworkOnly({
      plugins: [
        {
          fetchDidFail: async ({originalRequest, request, error, event}) => {
            // No return expected.
            // NOTE: `originalRequest` is the browser's request, `request` is the
            // request after being passed through plugins with
            // `requestWillFetch` callbacks, and `error` is the exception that caused
            // the underlying `fetch()` to fail.
            let storableRequest = await StorableRequest.fromRequest(request);

            let todo = {
              _id: new Date().toISOString(),
              storableRequest: storableRequest.toObject(),
            }
            db.put(todo, function callback(err, result) {
              if (!err) {
                console.log('Saved failed request in IDB');
              }
            });

          }
        }

      ]
    }),
    'PUT'
  );
}else {

  const bgSyncToggle = new workbox.backgroundSync.Plugin('toggleQueue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
  });
  const bgSyncImage = new workbox.backgroundSync.Plugin('imageQueue', {
    maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
  });

  workbox.routing.registerRoute(
    new RegExp('/toggle'),
    new workbox.strategies.NetworkOnly({
      plugins: [ bgSyncToggle]
    }),
    'PUT'
  );


  workbox.routing.registerRoute(
    new RegExp('/image'),
    new workbox.strategies.NetworkOnly({
      plugins: [ bgSyncImage]
    }),
    'PUT'
  );
}




} else {
  console.log("Workbox isn't supported")
}

// StorableRequest class for iOS insprired by workbox
if(iOS){
  const serializableProperties = [
    'method',
    'referrer',
    'referrerPolicy',
    'mode',
    'credentials',
    'cache',
    'redirect',
    'integrity',
    'keepalive',
  ];

  class StorableRequest {

    static async fromRequest(request) {

      const requestInit = {headers: {}};
      if (request.method !== 'GET') {
        // Use blob to support non-text request bodies,
        // and clone first in case the caller still needs the request.
        requestInit.body = await request.clone().arrayBuffer();
      }
      // Convert the headers from an iterable to an object.
      for (const [key, value] of request.headers.entries()) {
        requestInit.headers[key] = value;
      }

      // Add all other serializable request properties
      for (const prop of serializableProperties) {
        if (request[prop] !== undefined) {
          requestInit[prop] = request[prop];
        }
      }
      return new StorableRequest(request.url, requestInit);
    }

    constructor(url,requestInit){
      this.url = url;
      this.requestInit = requestInit;
    }

    toRequest(){
      return new Request(this.url,this.requestInit);
    }

    toObject() {
      return {
        url: this.url,
        requestInit: this.requestInit,
      };
    }



  }
}

