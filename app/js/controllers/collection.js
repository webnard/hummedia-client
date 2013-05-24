'use strict';
function CollectionCtrl($scope, $routeParams, Collection) {
    
    function loadPosterImage(collection, video){
        var image = document.createElement("img");
        image.src = collection.videos[video]['ma:image'][0]['poster'];
        image.onload = function() {
            collection.videos[video].currentImage = collection.videos[video]['ma:image'][0]['poster'];
            $scope.$digest();
        };     
    };
    
    function setCurrentImage(collection, video){
        collection.videos[video].currentImage = collection.videos[video]['ma:image'][0]['thumb'];
        loadPosterImage(collection, video);
    }
    
    var pid;
    if($routeParams.id===''){
        pid='null';
    }else{
        pid=$routeParams.id;
    }

    $scope.collection_data = Collection.get({identifier:pid}, function(){
        //Load Thumbnail images and switch to the poster image when the poster image loads
        for(var i=0; i<$scope.collection_data.videos.length; i++){
            setCurrentImage($scope.collection_data, i);
        }    
    });   
}
// always inject this in so we can later compress this JavaScript
CollectionCtrl.$inject = ['$scope', '$routeParams', 'Collection'];