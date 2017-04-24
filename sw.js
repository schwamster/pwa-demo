"use strict";

var version = "1.0.1";
var carDealsCacheName = 'carDealsCacheV1';
var carDealsCachePageName = 'carDealsCachePagesV1';
var carDealsCacheImageName = 'carDealsCacheImagesV1';

var carDealsCacheFiles = [
    'dist/bundle.js',
    'node_modules/material-design-lite/material.min.css',
    'node_modules/material-design-lite/material.min.js',
    './',
    'index.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

var latestPath = '/pluralsight/courses/progressive-web-apps/service/latest-deals.php';
var imagePath = '/pluralsight/courses/progressive-web-apps/service/car-image.php';
var carPath = '/pluralsight/courses/progressive-web-apps/service/car.php';

self.addEventListener('install', function(event){
    console.log('From SW: Install Event', event);
    self.skipWaiting();
    event.waitUntil(
        caches.open(carDealsCacheName)
        .then(function(cache){
            return cache.addAll(carDealsCacheFiles);
        })
    );
});

self.addEventListener('activate', function(event){
    console.log('From SW: Activate State', event);
    self.clients.claim();
    event.waitUntil(
        caches.keys()
        .then(function(cacheKeys){
            var deletePromises = [];            
            for(var i = 0; i < cacheKeys.length; i++){
                if(cacheKeys[i] != carDealsCacheName && 
                   cacheKeys[i] != carDealsCachePageName &&
                   cacheKeys[i] != carDealsCacheImageName){
                    console.log("delete cache", cacheKeys[i]);
                    deletePromises.push(caches.delete(cacheKeys[i]));
                }
            }
            return Promise.all(deletePromises);
        })
    );
});

self.addEventListener('fetch', function(event){
    var requestUrl = new URL(event.request.url);
    var requestPath = requestUrl.pathname;
    var fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1);

    if(requestPath == latestPath || fileName == 'sw.js'){
        event.respondWith(fetch(event.request));
    } else if(requestPath == imagePath){
        event.respondWith(networkFirstStrategy(event.request));
    } else {
        event.respondWith(cacheFirstStrategy(event.request));
    }
    
});

function cacheFirstStrategy(request){
    return caches.match(request).then(function(cacheResponse){
        return cacheResponse || fetchRequestAndCache(request);
    })
}

function networkFirstStrategy(request){
    return fetchRequestAndCache(request).catch(function(response){
        return caches.match(request);
    })
}

function fetchRequestAndCache(request){
    return fetch(request).then(function(networkResponse){
        caches.open(getCacheName(request)).then(function(cache){
            cache.put(request, networkResponse);
        });
        return networkResponse.clone();
    });
}

function getCacheName(request){
    var requestUrl = new URL(request.url);
    var requestPath = requestUrl.pathname;

    if(requestPath == imagePath){
        return carDealsCacheImageName;
    }else if (requestPath == carPath){
        return carDealsCachePageName;
    }else{
        return carDealsCacheName;
    }
}

self.addEventListener('message', function(event){
    if(event.source.id){
        var msg = `hello from sw. Triggered by msg from client: ${event.data}`;
        event.source.postMessage({clientId:event.source.id, message: msg});
    }
})