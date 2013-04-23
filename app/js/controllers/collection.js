'use strict';
function CollectionCtrl($scope, $routeParams, Collection) {
    var pid;
    if($routeParams.id===''){
        pid='null';
    }else{
        pid=$routeParams.id;
    }
    $scope.collection_data = Collection.get({identifier:pid});
}
// always inject this in so we can later compress this JavaScript
CollectionCtrl.$inject = ['$scope', '$routeParams', 'Collection'];