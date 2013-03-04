'use strict';

/* Directives */

angular.module('hummedia.directives', [])
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
    })
    /**
     * Disables an input field when the expression in the disable-when attribute
     * is true.
     */
    .directive('disableWhen', function(){
	return function($scope, elm, attrs) {
	    $scope.$watch(attrs.disableWhen, function(value) {
		if(value) {
		    $(elm).attr("disabled","disabled");
		}
		else
		{
		    $(elm).removeAttr("disabled");
		}
	    });
	};
    })
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
    })
    // displays an error modal when something bad happens.
    .directive('apiErrorModal', ['$rootScope', '$location', '$templateCache', function($rootScope, $location, $templateCache){
        
        // with the simplicity of these partials it doesn't make sense to create separate files for them
        $templateCache.put('400.html', '{{"Invalid Request. Make sure the address you are trying to reach is correct." | tr}}');
        $templateCache.put('404.html', '{{"The resource you requested could not be found." | tr}}');
        $templateCache.put('500.html', '{{"There was an error processing your request." | tr}}');
        
        return {
            restrict: 'A',
            scope: false,
            template: '<section><div id="error-message"><menu><button class="error-exit icon-remove-sign"> {{"Close" | tr}}</button></menu><h1>{{code}}</h1><p ng-include="page"></p></div></section>',
            transclude: true,
            replace: true,
            compile: function(element, attrs, transclude) {
                var isShowing = false;
                var startURL = null; // set to the URL of whatever page breaks
                
                return function postLink(scope, iElement, iAttrs, controller) {
                    element.hide();
                    var close = function() {
                        isShowing = false;
                        $(iAttrs.blur).removeClass('blur');
                        element.hide();
                        $rootScope.apiError = null; // remove the error
                    };
                    
                    element.find('.error-exit').click(close);
                    
                    // closes the modal window if we go to a different page
                    scope.$watch(function() { return $location.absUrl()}, function(value) {
                        if(value === startURL) {
                            return;
                        }
                        startURL = null; // so if we leave and come back this still works
                        close();
                    });
                    
                    // opens the modal window when a new API error happens
                    scope.$watch(function(){return $rootScope.apiError;}, function(value) {
                        if(value === undefined || value === null || isShowing) {
                            // do nothing
                            return;
                        }
                        scope.code = value;
                        switch(value) {
                            case 400:
                                scope.page = '400.html';
                                break;
                            case 404:
                                scope.page = '404.html';
                                break;
                            case 500:
                            default:
                                 scope.page = '500.html';
                                 break;
                        }
                        $(iAttrs.blur).addClass('blur');
                        element.show();
                        startURL = $location.absUrl();
                        isShowing = true;
                    });
                };
            }
        };
    }]);
