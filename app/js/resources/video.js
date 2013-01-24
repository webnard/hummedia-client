'use strict';

angular.module('hummedia.services').
    factory('Video', ['$resource', 'appConfig', function($resource, config, $q){
        var resource = $resource(config.apiBase + '/video/:identifier', {identifier: '@identifier'},
        {
            search: {method: 'GET', isArray: true, params: {searchtype: 'keyword', q: '@q'}}
        });
    
	/**
	 * Wrapper for the search method that alters the parameter list passed in.
	 * This will change all parameter values into a single string passed through
	 * the q parameter, as per the API's expectations
	 * 
	 * @params - same as $resource.get()'s parameters
	 */
	resource.advancedSearch = function(params){
	    var newArgs = arguments;
	    var advParams = {searchtype: 'advanced', q: ''};
	    
	    // note that these are auto URI-encoded by the resource.search method below
	    angular.forEach(params, function(val, key) {
		advParams.q += (advParams.q? "&" : "") + "dc." + key + ":" + val;
	    });
	    newArgs[0] = advParams;
	    
	    /**
	     * @todo: No idea what "this" should be here, so I'm just using the current scope
	     */
	    return resource.search.apply(this, newArgs);
	};
        return resource;
    }]);