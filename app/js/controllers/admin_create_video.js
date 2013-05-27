"use strict";
function AdminCreateVideo($scope, Youtube, Video, $routeParams, $location) {
    $scope.videos;
    $scope.query;
    $scope.video = null;
    $scope.isSaving = false;
    
    // any defaults are put in here
    $scope.data = {
        "dc:coverage": "private"
    };
    
    $scope.search = function(query) {
        if(query === undefined) {
            query = $scope.query;
        }
        $location.search({q: query});
    };

    $scope.$watch(function(){return $routeParams.id}, function(id) {
        loadVideo(id);
    });
    
    $scope.$watch(function(){return $routeParams.q}, function(query) {
        $scope.query = query;
        searchVideo(query);
    });

    function searchVideo(query) {
        // anything falsy, but numeric values are okay
        if(query === '' || query === null || query === false || query === undefined) {
            return;
        }
        $scope.video = null;
        Youtube.search(query).success(function(data) {
            $scope.videos = data;
        });
    }
    
    function loadVideo(id) {
        if(!id) {
            return;
        }
        Youtube.get(id).success(function(data) {
            if(data.error) {
                alert("There was an error retrieving your video.");
            }
            var video = data.items[0];
            $scope.video = video;
            $scope.data['ma:title'] = video.snippet.title;
            $scope.data['ma:description'] = video.snippet.description;
            $scope.data['ma:date'] = video.snippet.publishedAt.slice(0,4);
            $scope.data['url'] = ['http://youtu.be/' + id];
            $scope.data['type'] = 'yt';
        });
    };

    $scope.select = function(video) {
        $location.search({id: video.id.videoId});
    };
    
    $scope.reset = function(video) {
        $scope.video = null;
        $location.search(null);
    };
    
    $scope.watch = function(id) {
        Youtube.watch(id);
    };
    
    $scope.save = function() {
        $scope.isSaving = true;
        Video.save($scope.data, function(data) {
           $location.path('/video/', data.pid); 
        });
    };
    
    $scope.videoChosen = function() {
        return !!$scope.video;
    };
};
AdminCreateVideo.$inject = ['$scope','Youtube', 'Video', '$routeParams','$location'];
