"use strict";
HUMMEDIA_DIRECTIVES
    /***
     * Currently this is being used only on the search box.
     * This slides up the search box when the user scrolls down the page, then fixes it
     * This only works when the value of the pop-me-up method is true
     */
    .directive('popMeUp', function(){
	return function($scope, elm, attrs) {
	    // when we slide up the search box
	    var slideupval; // @todo: This should be less generic
	    var originalSearchMarginTop; // so we can put it back
	    var originalSearchTop; // so we can put it back
	    var isTopped = false;
	    var originalBackground;
	    var canJump = $scope.$eval(attrs.popMeUp);
	    
	    var setValues = function() {
		slideupval = $(elm).offset().top - $("nav").height(); // @todo: This should be less generic
		originalSearchMarginTop = $(elm).css('margin-top'); // so we can put it back
		originalSearchTop = $(elm).css('top'); // so we can put it back
		originalBackground = $(elm).css('background-color');
	    };
	    
	    var reset = function() {
		$(elm).css('margin-top',originalSearchMarginTop);
		$(elm).css('top',originalSearchTop);
		$(elm).css("box-shadow","none");
		$(elm).css("background-color",originalBackground);
	    };
	
	    var setTop = function() {
		$(elm).css('margin-top','0px');
		$(elm).css('top','0');
		$(elm).css("box-shadow","0px 0px 100px black");
		$(elm).css("background-color","#EEE");
	    };
	    
	    $scope.$watch(attrs.popMeUp, function(newValue, oldValue){
		if(newValue && !oldValue) {
		    setValues();
		    canJump = true;
		}
	    
		if(!newValue) {
		    canJump = false;
		    reset();
		}
	    });

	    // slides the search box up as we scroll down
	    var checkScrollPosition = function() {
		if(!canJump) {
		    return;
		}
		if(window.scrollY > slideupval) {
		    if(!isTopped) {
			setTop();
		    }
		    isTopped = true;
		}
		else if(isTopped)
		{
		    reset();
		    isTopped = false;
		}
	    };
	
	    if(canJump) {
		setValues();
	    }

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