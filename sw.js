const cacheName = 'bombu-v1.41';
const assets = [
    './', // stored in case of user
    './index.html',
    './style.css',
    './index.js',
    './king.jpg'
];
/* Start the service worker and cache all of the app's content */
self.addEventListener('install', event=>
    event.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(assets);
        })
    )
);
/* Activate the service worker (after install event and all install (eg browser tabs) are closed) */
self.addEventListener('activate', event=> {
        // remove old cache names
        event.waitUntil(
            caches.keys().then(keys=> Promise.all(keys=>
                keys
                    .filter(key=>key!==cacheName)
                    .map(key=> caches.delete(key))
            )
        ))
    }
);

/* Serve cached content when offline */
self.addEventListener('fetch', event=>
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    )
);