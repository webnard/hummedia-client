'use strict';
function SearchCtrl($scope, $routeParams, Collection) {
    $scope.results = [{title: "Dr. Zhivago"}];
    $scope.query = $routeParams.query;
    var collections = Collection.query();
    
    console.log(collections);
}
SearchCtrl.$inject = ['$scope', '$routeParams', 'Collection'];