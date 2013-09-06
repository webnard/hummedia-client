'use strict';

angular.module('hummedia.services').
    factory('Video', ['$resource', 'appConfig', '$http', function($resource, config, $http){
        var resource = $resource(config.apiBase + '/video/:identifier', {identifier: '@identifier'},
        {
            search: {method: 'GET', isArray: true, params: {searchtype: 'keyword', q: '@q'}},
	        advancedSearch: {method: 'GET', isArray: true},
            update: {method: 'PATCH'}
        });
	    resource.advancedParams = ['yearfrom','yearto','ma:title','ma:description'];

        resource.files = function() {
            return $http.get(config.apiBase + '/batch/video/ingest').then(function(a){
                return a.data;
            });
        };

        resource.ingest = function(filepath, pid, uniqueID) {
            return $http.post(config.apiBase + '/batch/video/ingest',[{filepath: filepath, pid: pid, id: uniqueID}]);
        }

        return resource;
    }]);
