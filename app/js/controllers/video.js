'use strict';
function VideoCtrl($scope, $routeParams, Video) {
    $scope.video = Video.get({identifier:$routeParams.id}, function(){
        if($scope.video['url'] && $scope.video['url'].length) {
            var pop = Popcorn.smart('#popcorn-player', $scope.video['url']);
            pop.play();
        }
    });
}
// always inject this in so we can later compress this JavaScript
VideoCtrl.$inject = ['$scope', '$routeParams', 'Video'];