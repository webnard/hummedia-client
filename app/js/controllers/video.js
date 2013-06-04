'use strict';
function VideoCtrl($scope, $routeParams, Video, Annotation) {
    var annotation_ids = {}, // PID-keyed arrays of track event IDs, as specified by Popcorn
        pop; // the Popcorn object, initialized under Video.get below
    
    function disableAnnotation(annotation) {
        var index = annotation.pid;
        
        // make sure it's ready
        if(!pop instanceof Popcorn || annotation_ids[index] === undefined)
            return;
        
        annotation_ids[index].forEach(function(id) {
            pop.removeTrackEvent(id);
        });
    };
    
    function enableAnnotation(annotation) {
        var ids = [];
        annotation.media[0].tracks.forEach(function(element){
            element.trackEvents.forEach(function(element){
                pop[element.type](element.popcornOptions);
                ids.push(pop.getLastTrackEventId());
            });
        });
        annotation_ids[annotation.pid] = ids;
    }
    
    $scope.toggleAnnotation = function(annotation) {
        if(annotation.enabled) {
            disableAnnotation(annotation);
            annotation.enabled=false;
        }
        else
        {
            enableAnnotation(annotation);
            annotation.enabled=true;
        }
    };        
    
    $scope.video = Video.get({identifier:$routeParams.id}, function loadPopcorn(){
        
        var required_annotation = $scope.video['ma:isMemberOf'].restrictor;
        var annotation_id = $routeParams.annotation;
        
        pop = Popcorn.smart("popcorn-player", $scope.video.url);
        $scope.annotations = Annotation.query({"dc:relation":$scope.video.pid, "client":"popcorn"}, function loadEachAnnotation(){
            console.log($scope.annotations);
            $scope.annotations.forEach(function(data, idx){
                if(data.media[0].tracks[0].id===required_annotation){
                    $scope.annotations.required = data;
                    enableAnnotation(data);
                }
                if(data.media[0].tracks[0].id===annotation_id){
                    $scope.annotations.optional = data;
                    enableAnnotation(data);
                    data.enabled=true;
                }                

            });
            pop.play();
        });
    });
}
// always inject this in so we can later compress this JavaScript
VideoCtrl.$inject = ['$scope', '$routeParams', 'Video', 'Annotation'];