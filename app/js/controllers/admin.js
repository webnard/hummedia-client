'use strict';
function AdminCtrl($scope, $routeParams, Collection) {
    $scope.collections = Collection.query();
    $scope.newCollection = function(){
        Collection.save({"dc:title":"New Collection"});
        $scope.collections = Collection.query();
    };
    $scope.deleteCollection = function(pid){
        Collection.delete({"identifier":pid});
        $scope.collections = Collection.query();
    };
}
// always inject this in so we can later compress this JavaScript
AdminCtrl.$inject = ['$scope', '$routeParams', 'Collection'];