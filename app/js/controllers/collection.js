'use strict';
function CollectionCtrl($scope, $routeParams, Collection) {
    $scope.collection_data = Collection.get({identifier:$routeParams.id});
    //console.log($scope.collection_data);
}
// always inject this in so we can later compress this JavaScript
CollectionCtrl.$inject = ['$scope', '$routeParams', 'Collection'];