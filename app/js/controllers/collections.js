'use strict';
function CollectionsCtrl($scope, $routeParams, Collection) {
    $scope.collections = Collection.query();
    $scope.$watch(function(){return $scope.collections.length;}, function(){
        $scope.collection = $scope.collections[0];        
        $scope.collections_data=[];
            $('#tabs p:first-child').addClass("highlighted");
        for(var i=0; i<$scope.collections.length; i++){
            var pid = $scope.collections[i]['pid'];
            var item = Collection.get({identifier:pid});
            $scope['collections_data'][pid] = item;
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