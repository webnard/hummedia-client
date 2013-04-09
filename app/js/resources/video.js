'use strict';

angular.module('hummedia.services').
    factory('Video', ['$resource', 'appConfig', function($resource, config, $q){
        var resource = $resource(config.apiBase + '/video/:identifier', {identifier: '@identifier'},
        {
            search: {method: 'GET', isArray: true, params: {searchtype: 'keyword', q: '@q'}},
	    advancedSearch: {method: 'GET', isArray: true},
            update: {method: 'PATCH'}
        });
	resource.advancedParams = ['yearfrom','yearto','ma:title','ma:description'];
	
        return resource;
    }]);