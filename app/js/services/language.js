/**
 * Allows for changing the locale and performing translations
 */
HUMMEDIA_SERVICES.factory('language', ['analytics','$http', 'user', 'appConfig', function(analytics, $http, user, appConfig) {
    var defaultLang = "en"; // default
    var language = {};
    var translations = null; // to be loaded; a key-value object of translations
    var translatable = $http.get('translations/ALL.json') // list of available translations
        .then(function(response) {
            var codes = [];
            for(var i = 0; i<response.data.length; i++) {
                codes.push({label: response.data[i], value: response.data[i]});
            }
            return codes;
        });

    var langHttpConfig = {
        url: appConfig.apiBase + "/language",
        withCredentials: false,
        method: "GET"
    };

    // all available languages as defined by the API
    var languages = $http(langHttpConfig)
        .then(function formatLanguages(response) {
            var languages = [],
                data      = response.data,
                length    = data.length;

            for(var i = 0; i<length; i++) {
                var obj = {value: data[i][0], label: data[i][1]};
                languages.push(obj);
            } 
            return languages;
        });

    // Tells us if the language code exists
    // requires that the languages already be loaded
    var translationExists = function( code ) {
        for(var i = 0; i < translatable.$$v.length; i++) {
            if(translatable.$$v[i]['label'] === code) {
                return true;
            }
        }
        return false;
    };

    user.checkStatus().then(function(){
        language.current = user.data.preferredLanguage;
    });


    Object.defineProperty(language, "all", {
        value: languages,
        configurable: false,
        enumerable: true,
        writable: false
    });

    /**
     * @DEPRECATED
     **/
    Object.defineProperty(language, "list", {
        get: function() {
            if(console && typeof console.warn == "function") {
                console.warn("language.list is deprecated. use language.translatable instead.");
            }
            return translatable;
        },
        configurable: false,
        enumerable: true
    });

    // List of available locales, languages we can translate into
    Object.defineProperty(language, "translatable", {
        value: translatable,
        configurable: false,
        enumerable: true,
        writable: false
    });

    // The current locale for the site
    Object.defineProperty(language, "current", {
        get : function(){
            return window.localStorage['language'] || defaultLang;
        },
        set : function(str) {
            // don't set if there's nothing to change
            if(typeof str != "string" || str === this.current || !str) {
                return;
            }

            languages.then(function() { // some defensive maneuvering to help us not set a language when we don't know if it exists or not yet
                
                // and don't change it if the language doesn't exist
                if(!translatationExists(str)) {
                    return;
                }

                analytics.event('Language','Switch',str);
                translations = null; // reset
                window.localStorage['language'] = str;
                /**
                 * @todo: Figure out how to reload the angular localization files
                 * and get them to work when switching languages. Right now simply calling loadLanguage won't work
                 */
                //window.location.reload();
            });
        },
        configurable : false,
        enumerable: true
    });
    /**
     * @TODO: Load and enable localization files
     */
    language.loadLanguage = function() {
        //$.getScript("//code.angularjs.org/1.0.3/i18n/angular-locale_" + this.current + ".js");
    };

    // lazily loading translations
    language.translate = function(str) {
        // default language should be the same language as the string we're translating
        if(this.current === defaultLang) {
            return str;
        }
        else if(translations === null) { // should only ever happen when we switch a language

            $http.get('translations/' + this.current + '.json')
                .success(function(data) {
                    translations = data;
                })
                .error(function() {
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

    /** 
     * Returns a language's English name based on its code.
     * This should typically be used in a filter or something
     * that is digested frequently, as it depends on the result of
     * an initial AJAX call before it can return a good value.
     *
     * @example: language.nameFromCode("en") [returns "English"]
     */
    language.nameFromCode = (function generateNameFromCodeFn() {
        var data = {};

        // I would normally have put my logic in here and return a promise, but since this is used in filters it would cause an infinite loop
        language.all.then(function setDataToLanguages(list) {
            var len = list.length;
            
            for(var i = 0; i<len; i++) {
                data[list[i]["value"]] = list[i]["label"];
            }
        });

        return function(code) {
            return data[code] || code;
        };
    })();

    Object.seal(language);
    Object.freeze(language);

    language.loadLanguage();
    return language;
}]);
