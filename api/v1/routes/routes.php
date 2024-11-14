<?php

declare(strict_types=1);

/*
-------------------------------------------------------------------------------
les routes
-------------------------------------------------------------------------------
 */

return [
    // Récupérer tous les tricks
    ['GET', '/api/v1/tricks', 'TrickController@index'],
    
    // Récupérer un trick spécifique
    ['GET', '/api/v1/tricks/{id:\d+}', 'TrickController@show'],
    
    // Ajouter un nouveau trick
    ['POST', '/api/v1/tricks', 'TrickController@create'],
    
    // Mettre à jour un trick existant
    ['PATCH', '/api/v1/tricks/{id:\d+}', 'TrickController@update'],
    
    // Supprimer un trick
    ['DELETE', '/api/v1/tricks/{id:\d+}', 'TrickController@delete'],
    
    // Pour les grinds
    ['GET', '/api/v1/grinds', 'GrindController@index'],
    ['GET', '/api/v1/grinds/{id:\d+}', 'GrindController@show'],
    ['POST', '/api/v1/grinds', 'GrindController@create'],
    ['PATCH', '/api/v1/grinds/{id:\d+}', 'GrindController@update'],
    ['DELETE', '/api/v1/grinds/{id:\d+}', 'GrindController@delete'],
    
    // Pour les slides
    ['GET', '/api/v1/slides', 'SlideController@index'],
    ['GET', '/api/v1/slides/{id:\d+}', 'SlideController@show'],
    ['POST', '/api/v1/slides', 'SlideController@create'],
    ['PATCH', '/api/v1/slides/{id:\d+}', 'SlideController@update'],
    ['DELETE', '/api/v1/slides/{id:\d+}', 'SlideController@delete'],
];