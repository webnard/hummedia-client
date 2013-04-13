'use strict';
function CollectionsCtrl($scope, $routeParams, Collection) {
    $scope.collections = Collection.query();
    
    $scope.$watch(function(){return $scope.collections.length;}, function(){
        $scope.collections_data=[];
        for(var i=0; i<$scope.collections.length; i++){
            var pid = $scope.collections[i]['pid'];
            var item = Collection.get({identifier:pid});
            $scope['collections_data'][pid] = item;
        }            
    });
    
    $scope.hideVideos = function(pid){
        $('#'+pid).toggle();
    };
}
// always inject this in so we can later compress this JavaScript
CollectionCtrl.$inject = ['$scope', '$routeParams', 'Collection'];