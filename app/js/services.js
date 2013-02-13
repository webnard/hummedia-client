'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('hummedia.services', ['ngResource'], ['$provide', function($provide) {
	
    /**
     * Allows for changing the locale
     */
    $provide.factory('language', ['$location',function(){
	var defaultLang = "en"; // default
	
	var language = {};
	Object.defineProperty(language, "list", {
	    value: [{label: "English", value: "en"},{ label: "Español", value: "es"}],
	    configurable: false,
	    enumerable: true,
	    writable: false
	});
	Object.defineProperty(language, "current", {
	    get : function(){
		return window.localStorage['language'] || defaultLang;
	    },
	    set : function(str) {
		// we need to refresh, but we don't want this to infinitely loop
		if(str === this.current) {
		    return;
		}
		window.localStorage['language'] = str;
		window.location.reload();
	    },
            configurable : false,
	    enumerable: true
	});
	language.loadLanguage = function() {
	    $.getScript("http://code.angularjs.org/1.0.3/i18n/angular-locale_" + this.current + ".js");
	};
	/**
	 * @TODO
	 */
	language.translate = function(str) {
	    
	};
	Object.seal(language);
	Object.freeze(language);

	language.loadLanguage();
	return language;
    }]);
}]);
