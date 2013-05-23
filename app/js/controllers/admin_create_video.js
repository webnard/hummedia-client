"use strict";
function AdminCreateVideo($scope, Youtube) {
    $scope.videos;
    $scope.query;
    
    $scope.search = function() {
        Youtube.search($scope.query).success(function(data) {
            $scope.videos = data;
        });
    };
};
AdminCreateVideo.$inject = ['$scope','Youtube'];
