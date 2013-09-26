'use strict';
function CollectionsCtrl($scope, Collection, $routeParams, $location, user) {
        
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
        },1);
    };
    
    $scope.collections = Collection.query(function(){
        if(!$scope.collections.length){
            $scope.message = 'There are no collections to display.';
        }
        
        $scope.collections_data=[];
        
        //If no id is specified then show the first collection
        if(!$location.search().id){
            showVideos($scope.collections[0]['pid']);
        }
        
        for(var coll=0; coll<$scope.collections.length; coll++){
            (function(){
                var pid = $scope.collections[coll]['pid'];

                var item = Collection.get({identifier:pid}, function(){
                    for(var vid=0; vid<item.videos.length; vid++){
                        setCurrentImage(item, vid);
                    }; 
                    item.isLoading = false;
                });
                item.isLoading = true;
                $scope['collections_data'][pid] = item;
            })();
        }
    });
    
    function showVideos(pid){
        $scope.collections.$then(function() {
            for(var i=0; i<$scope.collections.length; i++){
                if($scope.collections[i]['pid']===pid){
                    $scope.collection = $scope.collections[i];
                    return;
                }
            }
            $scope.collection = {'dc:title':'Unable to Access Course',
                                 'dc:description':'Make sure the URL you are trying to reach is correct and that you are enrolled in this course'
            };
        });
    };

    $scope.$watch(function(){ return $location.search().id; }, function(val) {
        if(val) {
            showVideos(val);
        }
    });

    $scope.canEdit = function(collection) {
        return collection['dc:rights']['write'].indexOf(user.data.username) !== -1;
    }
}
// always inject this in so we can later compress this JavaScript
CollectionsCtrl.$inject = ['$scope', 'Collection', '$routeParams', '$location', 'user'];
