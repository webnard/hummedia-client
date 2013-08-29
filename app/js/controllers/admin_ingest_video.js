"use strict";
function AdminIngestCtrl($scope, Video, $location) {
    $scope.creating = false;
    $scope.videos = Video.files();

    $scope.setVideo = function(url) {
        $scope.video = {url: url, 'ma:title': url};
    }

    $scope.createVideo = function() {
        $scope.creating = true;
        Video.save($scope.video,function(data){
            $location.path("/admin/video").search({id: data.pid});
        });
    }
};
AdminIngestCtrl.$inject = ['$scope', 'Video', '$location'];
