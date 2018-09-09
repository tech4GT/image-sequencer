const filesToCache = [
  '/examples/#steps=',
  '/node_modules/jquery/dist/jquery.min.js',
  '/node_modules/bootstrap/dist/js/bootstrap.min.js',
  '/src/ui/prepareDynamic.js',
  '/dist/image-sequencer.js',
  '/examples/lib/urlHash.js',
  '/examples/lib/defaultHtmlStepUi.js',
  '/examples/lib/defaultHtmlSequencerUi.js',
  '/examples/demo.js',
  '/node_modules/imgareaselect/jquery.imgareaselect.dev.js',
  '/node_modules/bootstrap/dist/css/bootstrap.min.css',
  '/node_modules/font-awesome/css/font-awesome.min.css',
  '/node_modules/imgareaselect/distfiles/css/imgareaselect-default.css',
  '/examples/demo.css',
  'https://raw.githubusercontent.com/theleagueof/league-spartan/master/_webfonts/leaguespartan-bold.woff2',
  '/node_modules/font-awesome/fonts/fontawesome-webfont.woff2?v=4.5.0',
  '/examples/images/tulips.png'
];

const staticCacheName = 'image-sequencer-static-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName){
          return cacheName.startsWith('image-sequencer-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName){
          return caches.delete(cacheName);
        })
      );
    })
  );      
});

self.addEventListener('fetch', function(event) {
  console.log(event.request);
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});