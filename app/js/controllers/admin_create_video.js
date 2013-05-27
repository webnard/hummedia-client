"use strict";
function AdminCreateVideo($scope, Youtube, Video) {
    $scope.videos;
    $scope.query;
    $scope.video = null;
    $scope.isSaving = false;
    
    $scope.data = {};
    
    $scope.search = function() {
        Youtube.search($scope.query).success(function(data) {
            $scope.videos = data;
        });
    };
    
    $scope.select = function(video) {
        $scope.video = video;
        $scope.data['ma:title'] = video.snippet.title;
        $scope.data['ma:description'] = video.snippet.description;
        $scope.data['ma:date'] = video.snippet.publishedAt.slice(0,4);
        $scope.data['url'] = ['http://youtu.be/' + video.id.videoId];
        $scope.data['type'] = 'yt';
    };
    
    $scope.reset = function(video) {
        $scope.video = null;
    };
    
    $scope.watch = function(id) {
        Youtube.watch(id);
    };
    
    $scope.save = function() {
        $scope.isSaving = true;
        Video.save($scope.data, function(data) {
            
        });
    };
    
    $scope.videoChosen = function() {
        return !!$scope.video;
    };
};
AdminCreateVideo.$inject = ['$scope','Youtube', 'Video'];
