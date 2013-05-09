'use strict';

angular.module('hummedia.services').
    factory('Video', ['$resource', 'appConfig', 'Annotation', function($resource, config, annotation){
        var resource = $resource(config.apiBase + '/video/:identifier', {identifier: '@identifier'},
        {
            search: {method: 'GET', isArray: true, params: {searchtype: 'keyword', q: '@q'}},
	    advancedSearch: {method: 'GET', isArray: true},
            update: {method: 'PATCH'}
        });
        
	resource.advancedParams = ['yearfrom','yearto','ma:title','ma:description'];
        
        
        resource.getAnnotation = function(videoId, callback){
            /*This function retrieves the actual JSON annotation to be used.
             * Counterintuitively, Popcorn must still download the direct file later
             * We should try to get that fixed.
             * */
            annotation.query({"dc:relation":videoId}, function(annotation){
                callback(annotation);
            });
        }
        
        resource.loadPopcorn = function(videoId){
            /*This function gets the annotation and begins Popcorn.  No annotation means no video.*/
            resource.getAnnotation(videoId, function(annotation){
                
                /*The inefficiency here is astounding.  We already have the JSON object, 
                    but we need to get the url of the json document and pass that to 
                    Popcorn so that it can download it a second time.  We need to do some 
                    internal backend work for Popcorn to process a JSON object directly
                */
                var annotationUrl = annotation[0].resource + "?client=popcorn";
                //var annotationUrl = "../app/js/jsonTest.js";
                var pop;
                
                console.log("URL:" + annotationUrl);
                Popcorn.loadVCP("#popcorn-player", annotationUrl, function() {
                    //console.log("Pop.width:" +  pop.width);
                    pop = this;
                    //console.log(pop);
                    pop.video.width=600;
                    pop.video.height=400;
                });
            });
            
        }
	
        return resource;
    }]);
    
