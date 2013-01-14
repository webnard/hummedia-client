'use strict';

angular.module('hummedia.services').
    factory('Collection', ['$resource', 'appConfig', function($resource, config){
        var resource = $resource(config.apiBase + '/collection/:identifier', {identifier: '@identifier'},
        {
            search: {method: 'GET', isArray: true}
        });
        return resource;
    }]);
