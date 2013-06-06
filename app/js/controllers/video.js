'use strict';
function VideoCtrl($scope, $routeParams, Video, Annotation, Collection) {
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
        
        // if this annotation is already enabled, leave
        if(annotation_ids[annotation.pid] !== undefined) {
            return;
        }
        var ids = [];
        annotation.media[0].tracks.forEach(function(element){
            element.trackEvents.forEach(function(element){
                pop[element.type](element.popcornOptions);
                ids.push(pop.getLastTrackEventId());
            });
        });
        annotation_ids[annotation.pid] = ids;
    }
    
    $scope.toggleAnnotations = function() {
        $scope.annotations.forEach(function(a) {
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
        
        if($routeParams.collection === undefined) {
            // play video and leave. there are no annotations
            pop.play();
            return;
        }
        
        $scope.annotations = Annotation.query({"dc:relation":$scope.video.pid, "client":"popcorn"}, function loadEachAnnotation(){
            $scope.annotations.forEach(function(data){
                if(data.media[0].tracks[0].id===required_annotation){
                    data.required = true;
                }
                else
                {
                    $scope.has_optional_annotations = true;
                }
                enableAnnotation(data);
            });
            pop.play();
        });
    });
}
// always inject this in so we can later compress this JavaScript
VideoCtrl.$inject = ['$scope', '$routeParams', 'Video', 'Annotation', 'Collection'];