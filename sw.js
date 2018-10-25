
// Based on:
// https://github.com/minimal-xyz/minimal-pwa/blob/master/sw.js

var cacheStorageKey = 'mofo-hnpwa-1';

var cacheList = [
    '/',
    'favicon.ico',
    'icon192.png',
    'icon512.png',
    'index.html',
    'index.js'
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(cacheStorageKey).then(function (cache) {
            return cache.addAll(cacheList)
        }).then(function () {
            return self.skipWaiting()
        })
    )
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== cacheStorageKey)
                    .map(key => caches.delete(key)))));
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (response != null) {
                return response;
            }
            return fetch(e.request.url);
        })
    )
});
