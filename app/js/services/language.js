/**
 * Allows for lookup of language name from shortcode
 */
HUMMEDIA_SERVICES.factory('language', ['analytics','$http', 'user', 'appConfig', function(analytics, $http, user, appConfig) {
    var defaultLang = "en"; // default
    var language = {};

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

    Object.defineProperty(language, "all", {
        value: languages,
        configurable: false,
        enumerable: true,
        writable: false
    });

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

    return language;
}]);
