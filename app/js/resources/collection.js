'use strict';

angular.module('hummedia.services').
    factory('Collection', ['$resource', 'appConfig', function($resource, config){
        return $resource(config.apiBase + '/collection/:id', {id: '@id'},
        {
            query: {method: 'GET', headers: {dogs: 'bark'}, isArray: true}
        });
    }]);
