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
        annotation.enabledState = true;

    }
    
    $scope.toggleAnnotation = function(annotation) {
        if(!annotation.enabledState) {
            disableAnnotation(annotation);
        }
        else
        {
            enableAnnotation(annotation);
        }
    };
    
    $scope.video = Video.get({identifier:$routeParams.id}, function loadPopcorn(){
        pop = Popcorn.smart("popcorn-player", $scope.video.url);
        $scope.annotations = Annotation.query({"dc:relation":$scope.video.pid, "client":"popcorn"}, function loadEachAnnotation(){
            $scope.annotations.forEach(function(data, idx){
                data.pid = idx; // @TODO -- reflect actual PID
                data.enabledState = true;
                
                /**
                 * @todo - is this better with an ng-click? then we don't have a bunch of watches
                 */
                $scope.$watch(function() { return data.enabledState; }, function() {
                    $scope.toggleAnnotation(data);
                });
            });
            pop.play();
        });
    });
}
// always inject this in so we can later compress this JavaScript
VideoCtrl.$inject = ['$scope', '$routeParams', 'Video', 'Annotation'];