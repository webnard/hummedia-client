/**
 * Handles searching and displaying search results to the user
 */
'use strict';
function SearchCtrl($scope, $routeParams, Collection, $location) {
    
    $scope.query = $routeParams.query; // the user's search query
    $scope.results = Collection.search();
    
    // did we get anything from the search? updates the view accordingly
    $scope.hasResults = function() { return !$scope.results.length; }
    
    // For fun and excitement, update the URL as the user types their search
    $scope.change = function() {
        $location.path("search/" + $scope.query);
    }
}
// always inject this in so we can later compress this JavaScript
SearchCtrl.$inject = ['$scope', '$routeParams', 'Collection', '$location'];