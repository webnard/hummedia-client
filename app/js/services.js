'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('hummedia.services', ['ngResource'], ['$provide', function($provide) {
	
    /**
     * Allows for changing the locale
     */
    $provide.factory('language', ['$location',function(){
	var lang = "en"; // default
	
	var language = {};
	Object.defineProperty(language, "list", {
	    value: [{label: "English", value: "en"},{ label: "Español", value: "es"}],
	    configurable: false,
	    enumerable: true,
	    writable: false
	});
	Object.defineProperty(language, "current", {
	    get : function(){
		return lang;
	    },
	    set : function(str) {
		lang = str;
	    },
            configurable : false,
	    enumerable: true
	});
	Object.seal(language);
	Object.freeze(language);

	return language;
    }]);
}]);
