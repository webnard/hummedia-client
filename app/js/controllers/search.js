/**
 * Handles searching and displaying search results to the user
 */
'use strict';
function SearchCtrl($scope, $routeParams, Collection, $location) {
    
    $scope.query = $routeParams.query; // the user's search query
    $scope.results = Collection.search();
    $scope.results = [
	{title: 'Once Upon a Midnight Dreary'},
	{title: 'As I Pondered'},
	{title: 'Weak\'n\'Weary'},
	{title: 'Over Many a Quaint and Curious'},
	{title: 'Vol. 3 of Forgotten Lore', description: "When a crazy bird comes a'tapping, the residents start lamenting over lost love in this laugh-out-loud comedy."},
	{title: 'Tis a Visitor'},
	{title: 'I Muttered, Only This'},
	{title: 'Sorrow for my Sweet Lenore'},
	{title: 'NEVERMORE'}
    ];
    
    // For fun and excitement, update the URL as the user types their search
    $scope.change = function() {
        $location.path("search/" + $scope.query);
    }
}
// always inject this in so we can later compress this JavaScript
SearchCtrl.$inject = ['$scope', '$routeParams', 'Collection', '$location'];