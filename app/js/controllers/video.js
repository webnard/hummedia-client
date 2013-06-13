'use strict';
function VideoCtrl($scope, $routeParams, Video, Annotation) {
    var annotation_ids = {}, // PID-keyed arrays of track event IDs, as specified by Popcorn
        pop, // the Popcorn object, initialized under Video.get below
        annotations_enabled = true;
        
    $scope.has_optional_annotations = false;
    
    /**
     * Turns off an annotation, if annotation.required exists
     * @param {Annotation} annotation
     */
    function disableAnnotation(annotation) {
        if(annotation.required) {
            throw new Error("Cannot disable a required annotation");
        }
        
        var index = annotation.pid;
        
        // make sure it's ready / exists
        if(!pop instanceof Popcorn) {
            throw new Error("Popcorn player does not exist yet");
        }
        
        // the annotation does not exist
        if(annotation_ids[index] === undefined) {
            return;
        }
        
        annotation_ids[index].forEach(function(id) {
            pop.removeTrackEvent(id);
        });
        delete annotation_ids[index];
    };
    
    function enableAnnotation(annotation) {
        if(!pop instanceof Popcorn) {
            throw new Error("Popcorn player does not exist yet");
        }
        var index = annotation.media[0].id;
        
        if(annotation_ids[index] !== undefined) {
            throw new Error("Cannot enable the same annotation more than once.");
        }
        
        
        var ids = [];
        annotation.media[0].tracks.forEach(function(element){
            element.trackEvents.forEach(function(element){
                pop[element.type](element.popcornOptions);
                ids.push(pop.getLastTrackEventId());
            });
        });
        annotation_ids[index] = ids;
    }
    
    $scope.toggleAnnotations = function() {
        $scope.annotations.forEach(function(a) {
            if(a.required) {
                return; // this can't be toggled; it should always be on
            }
            
            if(annotations_enabled) {
                annotations_enabled = false;
                disableAnnotation(a);
            }
            else
            {
                annotations_enabled = true;
                enableAnnotation(a);
            }
        });
    };        
    
    $scope.video = Video.get({identifier:$routeParams.id}, function loadPopcorn(){
        
        var required_annotation = $scope.video['ma:isMemberOf'].restrictor;
        pop = Popcorn.smart("popcorn-player", $scope.video.url);
        
        if($routeParams.collection === undefined && !required_annotation) {
            // we're done here. there are no annotations.
            return;
        }
        
        /**
         * callback function for after we call methods on the Annotation resource
         * enables each individual annotation
         */
        var _loadEachAnnotation = function(){
            // helper function for the helper function ;)
            var loadAnnotation = function(data) {
                if(data.media[0].tracks[0].required) {
                    data.required = true;
                }
                else
                {
                    $scope.has_optional_annotations = true;
                }
                
                enableAnnotation(data);
            };
            
            if($scope.annotations instanceof Array) {
                $scope.annotations.forEach(loadAnnotation);
            }
            else
            {
                loadAnnotation($scope.annotation);
            }
        };
        
        if($routeParams.collection) {
            // we need to load an array of annotations
            var params = {"dc:relation":$scope.video.pid, "collection":$routeParams.collection, "client":"popcorn"};
            $scope.annotations = Annotation.query(params, _loadEachAnnotation);
        }
        else
        {
            // there is only one required annotation; load it
            $scope.annotations = Annotation.get({identifier: required_annotation}, _loadEachAnnotation);
        }
        
        
    });
}
// always inject this in so we can later compress this JavaScript
VideoCtrl.$inject = ['$scope', '$routeParams', 'Video', 'Annotation'];