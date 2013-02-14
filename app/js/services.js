'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('hummedia.services', ['ngResource'], ['$provide', function($provide) {
	
    /**
     * Allows for changing the locale and performing translations
     */
    $provide.factory('language', ['$location','$http',function($location, $http){
	var defaultLang = "en"; // default
	var language = {};
	var translations = null; // to be loaded; a key-value object of translations
	var loadingTranslations = false;
	
	Object.defineProperty(language, "list", {
	    /**
	     * @todo: Load this in dynamically?
	     */
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
		translations = null; // reset
		window.localStorage['language'] = str;
		/**
		 * @todo: Figure out how to reload the angular localization files
		 * and get them to work when switching languages. Right now simply calling loadLanguage won't work
		 */
		//window.location.reload();
	    },
            configurable : false,
	    enumerable: true
	});
	language.loadLanguage = function() {
	    $.getScript("http://code.angularjs.org/1.0.3/i18n/angular-locale_" + this.current + ".js");
	};
	
	// lazily loading translations
	language.translate = function(str) {
	    if(translations === null) { // should only ever happen when we switch a language
		
		translations = {};
		$http.get(window.location.pathname + '/translations/' + this.current + '.json')
		    .success(function(data) {
			loadingTranslations = false;
			translations = data;
		    })
		    .error(function() {
			loadingTranslations = false;
			translations = {};
		    });
	    }
	    else if(translations[str] === undefined || translations[str] === "") {
		return str;
	    }
	    else
	    {
		return translations[str];
	    }
	};
	Object.seal(language);
	Object.freeze(language);

	language.loadLanguage();
	return language;
    }]);
}]);
