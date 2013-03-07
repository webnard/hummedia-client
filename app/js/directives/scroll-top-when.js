"use strict";
HUMMEDIA_DIRECTIVES
    /**
     * Scrolls to the top of this element when the scroll-top-when attribute evals to true
     * This only works when the page is not already scrolled up past the beginning of the element.
     * @todo: This should have a priority specified--a low one; it needs to happen AFTER DOM mutations
     */
    .directive('scrollTopWhen', function(){
	return function($scope, elm, attrs) {
	    $scope.$watch(attrs.scrollTopWhen, function(val) {
		if(val) {
		    var top = $(elm).offset().top;
		    if(window.scrollY <= top) {
			return;
		    }
		    $('body').animate({scrollTop: top + "px"});
		}
	    });
	};
    });
