'use strict';

angular.module('hummedia.services').
    factory('Video', ['$resource', 'appConfig', function($resource, config){
        var resource = $resource(config.apiBase + '/video/:identifier', {identifier: '@identifier'},
        {
            //search: {method: 'GET', isArray: true}
        });
        return resource;
    }]);
