importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
importScripts('https://cdn.jsdelivr.net/npm/pouchdb@7.0.0/dist/pouchdb.min.js')

const db = new PouchDB('todos');


if (workbox) {
  workbox.setConfig({debug: true});
  workbox.skipWaiting();
  workbox.clientsClaim();
  console.log("WorkBox Works!")
  workbox.precaching.precacheAndRoute([]);


  workbox.routing.registerRoute(
    new RegExp('https://api.entur.org/'),
    new workbox.strategies.StaleWhileRevalidate()
  );

  self.addEventListener('message',(event)=>{
    console.log('Replaying failed requests');

    db.allDocs({include_docs:true,descending:true},(err,doc)=>{
      for(let row of doc.rows){
        if(row.doc.request){
          let  storableRequest= row.doc.request;
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
              request: storableRequest.toObject(),
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

} else {
  console.log("Workbox isn't supported")
}

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
