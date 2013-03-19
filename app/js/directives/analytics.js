"use strict";
HUMMEDIA_DIRECTIVES
    .directive('analytics', ['analytics', function(analytics){
            return {
                restrict: 'A',
                replace: false,
                compile: function(element, attrs, transclude) {
                    return function postLink(scope, iElement, iAttrs, controller) {
                        
                        var required_attrs = ['analyticsLabel','analyticsCategory'];
                        
                        angular.forEach(required_attrs, function(a) {
                            if(!iAttrs[a]) {
                                console.log(iAttrs);
                                throw "Missing attribute or value for '" + a + "'";
                            }
                        });
                        
                        /**
                         * @todo: Keep this in here?
                         */
                        if(!iAttrs.analytics) {
                            console.warn("Analytics event added without events to ", element);
                            return;
                        }
                        var events = iAttrs.analytics.split(/,\s*/);
                        angular.forEach(events, function(event){
                            element.bind(event, function(){
                                analytics.event(iAttrs['analyticsCategory'],event,iAttrs['analyticsLabel']);
                            });
                        });
                    };
                }
            };
    }]);