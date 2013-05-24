'use strict';
function CollectionsCtrl($scope, $routeParams, Collection) {
        
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
        setTimeout(function(){
            loadPosterImage(collection, video);
        },1000);
    };
    
    $scope.collections = Collection.query(function(){
        if(!$scope.collections.length){
            $scope.message = 'There are no collections to display.';
        }
    });
    $scope.$watch(function(){return $scope.collections.length;}, function(){
        $scope.collection = $scope.collections[0];        
        $scope.collections_data=[];
        
        for(var coll=0; coll<$scope.collections.length; coll++){
            (function(){
                var pid = $scope.collections[coll]['pid'];
                var item = Collection.get({identifier:pid}, function(){
                    for(var vid=0; vid<item.videos.length; vid++){
                        setCurrentImage(item, vid);
                    }      
                });
                $scope['collections_data'][pid] = item;
            })();
        }
    });
    
    $scope.showVideos = function(pid){
        for(var i=0; i<$scope.collections.length; i++){
            if($scope.collections[i]['pid']===pid){
                $scope.collection = $scope.collections[i];
            }
        }       
    };
}
// always inject this in so we can later compress this JavaScript
CollectionCtrl.$inject = ['$scope', '$routeParams', 'Collection'];