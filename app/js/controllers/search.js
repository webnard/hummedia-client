/**
 * Handles searching and displaying search results to the user
 */
'use strict';
function SearchCtrl($scope, $routeParams, Collection, Video, $location) {
    
    var lastsearch = Date.now(); // when the last update was performed
    var timeout = 500; // milliseconds between searches
    var timer = null; // the timer waiting to perform another search
    
    $scope.query = $routeParams.query; // the user's search query
    $scope.results = [];
    $scope.isSearching = false;
    $scope.hasSearched = false;
    $scope.maxYear = new window.Date().getFullYear() + 1; // don't let anyone search past the current year (plus one, let's be generous)
    $scope.advanced = {};
    
    $scope.isAdvanced = function(){return !!$location.search().advanced;};
    
    // turns advanced search on or off
    $scope.toggleAdvanced = function() {
	if($scope.isAdvanced()) {
	    $location.search('advanced',null);
	    for(var i = 0; i<Video.validSearchKeys.length; i++) {
		$location.search(Video.validSearchKeys[i], null);
	    }
	}
	else
	{
	    $location.search('advanced');
	}
    };

    $scope.$watch(function(){return $routeParams.query}, function(val){
	$scope.query = val;
    });

    // tells us whether or not a search can possibly be performed
    $scope.canSearch = function() {
	if($scope.isAdvanced()) {
	    for(var i in $scope.advanced) {
		if($scope.advanced.hasOwnProperty(i) && $scope.advanced[i] !== '' && $scope.advanced[i] !== undefined) {
		    return true;
		}
	    }
	    return false;
	}
	else
	{
	    return !!$scope.query; // user input will always be true except when an empty string
	}
    };
    
    // performs another search (if canSearch())
    $scope.refresh = function() {
	clearTimeout(timer);
	timer = null;
	if(!$scope.canSearch()) {
	    $scope.results = [];
	    return;
	}
	$scope.hasSearched = true;
	$scope.isSearching = true;
	lastsearch = Date.now();
	
	var method, obj; // the method we search with, and the query we send it
	if($scope.isAdvanced()) {
	    method = Video.advancedSearch;
	    obj = $scope.advanced;
	    $location.search(jQuery.extend({},$location.search(),$scope.advanced));
	}
	else
	{
	    $location.search("query",$scope.query);
	    method = Video.search;
	    obj = {q: $scope.query};
	}
	
	$scope.results = method(obj, function(){
	    $scope.isSearching = false;
	    angular.forEach($scope.results, function(result) {
		result.type = 'video';
	    });
	});
    };
    // kick things off if there are already queries in the URL
    $scope.refresh();
    
    // For fun and excitement, update the URL as the user types their search
    $scope.change = function() {
	if(Date.now() - lastsearch > timeout && !timer) {
	    $scope.refresh(); // auto load data
	}
	else
	{
	    clearTimeout(timer);
	    timer = null;
	    timer = setTimeout(function(){$scope.refresh()}, timeout);
	}
    };
}
// always inject this in so we can later compress this JavaScript
SearchCtrl.$inject = ['$scope', '$routeParams', 'Collection', 'Video', '$location'];