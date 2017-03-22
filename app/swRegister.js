define([], function () {

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js')
            .then(function (swRegistration) {
                console.log(swRegistration);
            }).catch(function (error) {
                console.log('Error occured', error);
            })
    }

});