"use strict";
HUMMEDIA_DIRECTIVES
    .directive('analytics', ['analytics', function(analytics){
            return {
                restrict: 'A',
                replace: false,
                compile: function(element, attrs, transclude) {
                    return function postLink(scope, iElement, iAttrs, controller) {
                        console.log(iAttrs);
                    };
                }
            };
    }]);