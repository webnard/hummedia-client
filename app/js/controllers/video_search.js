'use strict';
function VideoSearchCtrl($scope, Video) {
    $scope.videos = [];
    $scope.query = '';
    $scope.searching = false;

    $scope.search = function() {
        $scope.searching = true;
        $scope.videos = Video.search({q: $scope.query}, function(){
            $scope.searching = false;
        });
    }
};
VideoSearchCtrl.$inject = ['$scope', 'Video'];
