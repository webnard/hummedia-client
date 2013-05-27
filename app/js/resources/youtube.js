'use strict';

angular.module('hummedia.services').
    factory('Youtube', ['appConfig', '$http', function(cfg, $http){
        var api = "https://www.googleapis.com/youtube/v3/";
        var callback = "&callback=JSON_CALLBACK";
        var _params = {
            callback: "JSON_CALLBACK",
            maxResults: "50",
            key: cfg.youtubeKey,
            part: "snippet",
            type: "video"
        };
        
        var resource = {};
        
        resource.search = function(query, parameters) {
            var config = {
                params: angular.extend(_params, parameters)
            };
            return $http.jsonp(api + "search?&q=" + query, config);
        };
        
        resource.watch = function(id) {
            window.open("http://www.youtube.com/watch?v=" + id);
        };
        
        return resource;
    }]);
