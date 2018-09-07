const filesToCache = [
  'index.html',
  'demo.css',
  '../icons/ic_192.png',
  'index.html',
  'demo.js',
  'lib/defaultHtmlSequencerUi.js',
  'lib/defaultHtmlStepUi.js',
  'lib/urlHash.js',
  'images/tulips.png',
  '../node_modules/jquery/dist/jquery.min.js',
  '../node_modules/bootstrap/dist/js/bootstrap.min.js',
  '../src/ui/prepareDynamic.js',
  '../dist/image-sequencer.js',
  '../node_modules/imgareaselect/jquery.imgareaselect.dev.js',
  '../node_modules/bootstrap/dist/css/bootstrap.min.css',
  '../node_modules/font-awesome/css/font-awesome.min.css',
  '../node_modules/imgareaselect/distfiles/css/imgareaselect-default.css',
  'images/cyan.jpg',
  'images/diagram-6-steps.png',
  'images/diagram-workflows.png',
  'images/grid-crop.png',
  'images/grid.png',
  'images/IS-QR.png',
  'images/load.gif',
  'images/monarch.png',
  'images/red.jpg',
  'images/red.png',
  'images/replace.jpg',
  'images/test.gif',
  'images/test.png',
  'images/test.png.js',
  'images/test.gif.js',
  'images/IS-QR.js',
  'fisheye.html',
  'replace.html',
  'demo-old.css'
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});