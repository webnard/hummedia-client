'use strict';
function AdminCtrl($scope, $routeParams, Collection) {
    $scope.collections = Collection.query();
   
    setTimeout(function(){console.log($scope.collections)}, 1000);
}
// always inject this in so we can later compress this JavaScript
AdminCtrl.$inject = ['$scope', '$routeParams', 'Collection'];