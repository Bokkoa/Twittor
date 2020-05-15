//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE      = 'static-v4';
const DYNAMIC_CACHE     = 'dynamic-v2';
const INMUTABLE_CACHE   = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

//todas las librerias necesarias que yo no hice
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js',
];


self.addEventListener('install', e => {
    
    console.log("entra");
    const addCacheStatic = caches.open( STATIC_CACHE )
            .then( cache => cache.addAll(APP_SHELL));
    const addCacheInmutable = caches.open( INMUTABLE_CACHE )
    .then( cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil( Promise.all( [addCacheStatic, addCacheInmutable] ));
});


self.addEventListener( 'activate', e => {

    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            //replace static cache
            if ( key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }

            //replace dynamic cache
            if ( key !== DYNAMIC_CACHE && key.includes('dynamic')){
                return caches.delete(key);
            }
        });
    });

    e.waitUntil( respuesta );
});


//CACHE CON NETWORK FALLBACK
self.addEventListener( 'fetch' , e => {

    const response = caches.match( e.request).then( res => {
        
        console.log("asset enviado: "+ res);

        if(res){
            return res;
        }else{
            //manejar posible error en el fetch
            return fetch( e.request ).then( newRes => {

                return actualizaCacheDinamico(DYNAMIC_CACHE,  e.request, newRes);

            });
        }

    });

    e.respondWith( response );
});