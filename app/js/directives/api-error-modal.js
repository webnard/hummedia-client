"use strict";
HUMMEDIA_DIRECTIVES
    // displays an error modal when something bad happens.
    .directive('apiErrorModal', ['$rootScope', '$location', '$templateCache', function($rootScope, $location, $templateCache){
        
        // with the simplicity of these partials it doesn't make sense to create separate files for them
        $templateCache.put('400.html', '{{"Invalid Request. Make sure the address you are trying to reach is correct." | tr}}');
        $templateCache.put('404.html', '{{"The resource you requested could not be found." | tr}}');
        $templateCache.put('500.html', '{{"There was an error processing your request." | tr}}');
        
        return {
            restrict: 'A',
            scope: false,
            template: '<section><div id="error-message"><menu><button class="error-exit icon-remove-sign"> {{"Close" | tr}}</button></menu><h1 class="error-code">{{code}}</h1><p ng-include="page"></p></div></section>',
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