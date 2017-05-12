self.addEventListener('fetch', function(event){
    var requestUrl = new URL(event.request.url);
    var requestPath = requestUrl.pathname;
    var fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1);

    console.log("fetch hit: ", requestUrl, requestPath);
    // if(requestPath == latestPath || fileName == 'sw.js'){
    //     event.respondWith(fetch(event.request));
    // } else if(requestPath == imagePath){
    //     event.respondWith(networkFirstStrategy(event.request));
    // } else {
    //     event.respondWith(cacheFirstStrategy(event.request));
    // }
    
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
