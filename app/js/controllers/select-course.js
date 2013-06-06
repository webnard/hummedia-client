"use strict";
// allows the user to specify a course to view their video as, if any
function SelectCourseCtrl($scope, $routeParams, $location, Video, Collection) {
    $scope.collections = [];
    $scope.loading = true;
    
    $scope.video = Video.get({identifier: $routeParams.video}, function(){
        $scope.loading = false;
        if(!$scope.video['ma:isMemberOf'].length) {
            $location.path('/video/' + $scope.video.pid);
            $location.replace(); // so they aren't forced to come back to this page when they click the back button
        }
        $scope.video['ma:isMemberOf'].forEach(function(coll){
            $scope.collections.push(Collection.get({identifier: coll['@id']}));
        });
    });
};
SelectCourseCtrl.$inject = ['$scope', '$routeParams', '$location', 'Video', 'Collection'];