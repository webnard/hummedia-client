'use strict';

angular.module('hummedia.services').
    factory('Youtube', ['appConfig', '$http', function(cfg, $http){
        var api = "https://www.googleapis.com/youtube/v3/";
        var callback = "&callback=JSON_CALLBACK";
        var _params = {
            callback: "JSON_CALLBACK",
            key: cfg.youtubeKey,
        };
        
        var resource = {};
        
        resource.get = function(id, parameters) {
            var config = {
                params: angular.extend(angular.copy(_params), {part: 'snippet'}, parameters)
            };
            return $http.jsonp(api + "videos?id=" + id, config);
        };
        
        resource.search = function(query, parameters) {
            var config = {
                params: angular.extend(angular.copy(_params), {maxResults: 50, type: "video", part: "snippet"}, parameters)
            };
            return $http.jsonp(api + "search?q=" + query, config);
        };
        
        resource.watch = function(id) {
            window.open("http://www.youtube.com/watch?v=" + id);
        };
        
        return resource;
    }]);
