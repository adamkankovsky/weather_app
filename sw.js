// sw.js

const CACHE_NAME = 'my-site-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

// Seznam statických souborů k uložení do cache během instalace
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

// Instalace Service Workera a uložení statických souborů do cache
self.addEventListener('install', function(evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Soubory jsou ukládány do cache');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivace Service Workera a odstranění starých cache
self.addEventListener('activate', function(evt) {
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Odstraňování staré cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Zachytávání a obsluha fetch událostí
self.addEventListener('fetch', function(evt) {
  const url = new URL(evt.request.url);

  // Kontrola, zda je požadavek směrován na OpenWeatherMap API
  if (url.origin === 'https://api.openweathermap.org') {
    evt.respondWith(
      fetch(evt.request)
        .then(networkResponse => {
          // Pokud je odpověď úspěšná, ulož ji do cache a vrať uživateli
          if (networkResponse.status === 200) {
            return caches.open(DATA_CACHE_NAME).then(cache => {
              cache.put(evt.request, networkResponse.clone());
              return networkResponse;
            });
          }
          // Pokud není odpověď úspěšná, pokus se získat data z cache
          return caches.match(evt.request);
        })
        .catch(() => {
          // Pokud síťový požadavek selže (např. offline), vrať data z cache
          return caches.match(evt.request);
        })
    );
    return;
  }

  // Obsluha ostatních požadavků (statické soubory)
  evt.respondWith(
    caches.match(evt.request).then(response => {
      return response || fetch(evt.request);
    })
  );
});
