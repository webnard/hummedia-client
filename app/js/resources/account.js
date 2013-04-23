'use strict';

angular.module('hummedia.services').
    factory('Account', ['$resource', 'appConfig', function($resource, config){
        var resource = $resource(config.apiBase + '/account/:_id', {_id: '@_id'},
        {
            search: {method: 'GET', isArray: true},
            update: {method: 'PATCH', isArray: false}
        });
        return resource;
    }]);
