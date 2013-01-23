'use strict';

/* Directives */

angular.module('hummedia.directives', [])
    .directive('popMeUp', function(){
	return function($scope, elm, attr) {
	    // when we slide up the search box
	    var slideupval = $(elm).offset().top;
	    var originalSearchTop = $(elm).css('margin-top'); // so we can put it back
	    var isTopped = false;
	    var originalBackground = $(elm).css('background-color');

	    // slides the search box up as we scroll down
	    var checkScrollPosition = function() {
		if(window.scrollY > slideupval) {
		    if(!isTopped) {
			$(elm).css('margin-top','0px');
			$(elm).css("box-shadow","0px 0px 100px black");
			$(elm).css("background-color","#EEE");
		    }
		    isTopped = true;
		}
		else if(isTopped)
		{
		    $(elm).css('margin-top',originalSearchTop);
		    $(elm).css("box-shadow","none");
		    $(elm).css("background-color",originalBackground);
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
	};
    });