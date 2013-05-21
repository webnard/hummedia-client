function AdminVideoCtrl($scope, Video, language, $routeParams, $location) {
    "use strict";
    
    $scope.videos =  Video.query();
    $scope.video = null;
    $scope.title_filter = "";

    var copy = null; // used for updating the user list while removing $scope.user

    $scope.setVideo = function(video) {
        copy = video;
        $scope.video = video;
        $location.search({id: video.pid});
    };

    $scope.cancel = function() {
        $scope.video = null;
        $location.search({});
        copy.$get().success(function(){copy = null});
    }

    // remember, delete is a reserved word, so we need to do this for compilation
    $scope['delete'] = function(video) {
        if(!confirm("Are you sure you want to delete " + video['ma:title'] + "(ID: " + video.pid + ")?")) {
            return;
        }
        $scope.video = null;
        copy = null;
        $location.search({});
        $scope.videos.forEach(function(u, index) {
            if(video === u) {
                video.$delete(function() {
                    $scope.videos.splice(index,1);
                });
            }
        });
    }

    $scope.$watch(function(){return $routeParams.id;}, function(val){
        $scope.id = $routeParams.id;
        if($scope.id){
            if($scope.video === null || $scope.video.pid !== val) {
                $scope.video = Video.get({pid:$routeParams.id}, function(){}, function(){
                    // error
                    $scope.video = null;
                    copy = null;
                });
                copy = $scope.video;
            }
        }
    });

    $scope.update = function() {
        $scope.video.isSaving = true;
        var u = $scope.video;
        $scope.video.$update(function(){
            u.isSaving = false;
        });
    }
};
AdminUserCtrl.$inject = ['$scope','Video', 'language', '$routeParams', '$location'];
