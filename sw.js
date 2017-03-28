"use strict";

var carDealsCacheName = 'carDealsCacheV1';
var carDealsCachePageName = 'carDealsCachePagesV1'

var carDealsCacheFiles = [
    'dist/bundle.js',
    'node_modules/material-design-lite/material.min.css',
    'node_modules/material-design-lite/material.min.js',
    './',
    'index.html',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', function(event){
    console.log('From SW: Install Event', event);
    event.waitUntil(
        caches.open(carDealsCacheName)
        .then(function(cache){
            return cache.addAll(carDealsCacheFiles);
        })
    );
});

self.addEventListener('activate', function(event){
    console.log('From SW: Activate State', event);
    event.waitUntil(
        caches.keys()
        .then(function(cacheKeys){
            var deletePromises = [];            
            for(var i = 0; i < cacheKeys.length; i++){
                if(cacheKeys[i] != carDealsCacheName && cacheKeys[i] != carDealsCachePageName){
                    console.log("delete cache", cacheKeys[i]);
                    deletePromises.push(caches.delete(cacheKeys[i]));
                }
            }
            return Promise.all(deletePromises);
        })
    );
});

