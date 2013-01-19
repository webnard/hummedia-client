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
    $scope.isAdvanced = function(){return !!$location.search().advanced;};
    $scope.toggleAdvanced = function() {
	if($scope.isAdvanced()) {
	    $location.search('advanced',null);
	}
	else
	{
	    $location.search('advanced');
	}
    }
    
    /**
     * @todo - Move presentational material to a directive
     */
    // when we slide up the search box
    var slideupval = $("#search_content").offset().top;
    var originalSearchTop = $("#search_content").css('margin-top'); // so we can put it back
    var isTopped = false;
    var originalBackground = $("#search_content").css('background-color');
    
    // slides the search box up as we scroll down
    var checkScrollPosition = function() {
	if(window.scrollY > slideupval) {
	    if(!isTopped) {
		$("#search_content").css('margin-top','0px');
		$("#search_content").css("box-shadow","0px 0px 100px black");
		$("#search_content").css("background-color","#EEE");
	    }
	    isTopped = true;
	}
	else if(isTopped)
	{
	    $("#search_content").css('margin-top',originalSearchTop);
	    $("#search_content").css("box-shadow","none");
	    $("#search_content").css("background-color",originalBackground);
	    isTopped = false;
	}
    };
    
    /**
     * @todo We should find a way to bind this to a specific element within this scope
     */
    $(window).on('scroll', checkScrollPosition);

    // remove the scroll function
    $scope.$on('$destroy', function cleanup() {
	$(window).off('scroll', checkScrollPosition);
    });
    
    // performs another search
    $scope.refresh = function() {
	clearTimeout(timer);
	timer = null;
	if(/^\s*$/.test($scope.query)) {
	    $scope.results = [];
	    return;
	}
	$scope.hasSearched = true;
	$scope.isSearching = true;
	lastsearch = Date.now();
	//$scope.results = Collection.search();
	
	$scope.results = Video.search({q: $scope.query}, function(){
	    $scope.isSearching = false;
	    angular.forEach($scope.results, function(result) {
		result.type = 'video';
	    });
	});
    };

    if($scope.query !== undefined) {
	$scope.refresh();
    }
    
    // For fun and excitement, update the URL as the user types their search
    $scope.change = function() {
        $location.search("query",$scope.query);
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