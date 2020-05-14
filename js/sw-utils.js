


//guardar en el cache dinamico
function actualizaCacheDinamico( dynamicCache, request, response ){

    if ( response.ok ) {

        //abrir cache
        caches.open( dynamicCache ).then( cache => {

            //actualizar cache
            cache.put( request, response.clone() );

            return response.clone();

        });

    }else{
        //no hubo ni en cache ni en network
        //retornar el error
        return response;
    }

}

