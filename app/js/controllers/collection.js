'use strict';
function CollectionCtrl($scope, $routeParams, Collection) {    
    var pid;
    if($routeParams.id===''){
        pid='null';
    }else{
        pid=$routeParams.id;
    }

    $scope.collection_data = Collection.get({identifier:pid}, function(){
        //Load Thumbnail images and switch to the poster image when the poster image loads
        for(var i=0; i<$scope.collection_data.videos.length; i++){
            (function(){
                var j = i;
                $scope.collection_data.videos[i].currentImage = $scope.collection_data.videos[i]['ma:image'][0]['thumb'];
                var image = document.createElement("img");
                image.src = $scope.collection_data.videos[i]['ma:image'][0]['poster'];
                image.onload = function() {
                    $scope.collection_data.videos[j].currentImage = $scope.collection_data.videos[j]['ma:image'][0]['poster'];
                    $scope.$digest();
                };
            })();
        }    
    });
    
}
// always inject this in so we can later compress this JavaScript
CollectionCtrl.$inject = ['$scope', '$routeParams', 'Collection'];