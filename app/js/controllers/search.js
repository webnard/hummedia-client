/**
 * Handles searching and displaying search results to the user
 */
'use strict';
function SearchCtrl($scope, $routeParams, Collection, $location) {
    
    var lastsearch; // when the last update was performed
    var timeout = 1000; // milliseconds between searches
    $scope.query = $routeParams.query; // the user's search query
    
    // when we slide up the search box
    var slideupval = $("#search_content").offset().top;
    var originalSearchTop = $("#search_content").css('margin-top'); // so we can put it back
    var isTopped = false;
    var originalBackground = $("#search_content").css('background-color');
    
    // slides the search box up as we scroll down
    /** @todo: remove this event when leaving this controller **/
    document.onscroll = function() {
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
    
    $scope.refresh = function() {
	lastsearch = Date.now();
	$scope.results = Collection.search();
//	$scope.results = [
//	    {title: 'Once Upon a Midnight Dreary'},
//	    {title: 'As I Pondered'},
//	    {title: 'Weak\'n\'Weary'},
//	    {title: 'Over Many a Quaint and Curious'},
//	    {title: 'Vol. 3 of Forgotten Lore', description: "When a crazy bird comes a'tapping, the residents start lamenting over lost love in this laugh-out-loud comedy."},
//	    {title: 'Tis a Visitor'},
//	    {title: 'I Muttered, Only This'},
//	    {title: 'Sorrow for my Sweet Lenore'},
//	    {title: 'NEVERMORE'}
//	];
    };

    $scope.refresh();
    
    // For fun and excitement, update the URL as the user types their search
    $scope.change = function() {
        $location.search("query",$scope.query);
	if(Date.now() - lastsearch > timeout) {
	    $scope.refresh(); // auto load data if 
	}
    };
}
// always inject this in so we can later compress this JavaScript
SearchCtrl.$inject = ['$scope', '$routeParams', 'Collection', '$location'];