'use strict';

angular.module('hummedia.services').
    factory('Account', ['$resource', 'appConfig', function($resource, config){
        var resource = $resource(config.apiBase + '/account/:identifier', {identifier: '@identifier'},
        {
            search: {method: 'GET', isArray: true},
            update: {method: 'PATCH'}
        });
        return resource;
    }]);
