"use strict";

/**
 * Adds Google Analytics event tracking to your element
 * 
 * Examples:
 *  <a href="#" analytics="{label: 'link', category: 'search'}>
 *
 *  <button analytics="{label: 'bigButton', category: 'form', events: ['click', 'hover', 'focus']}"
 *
 * Properties:
 *      label {required | string} give a label to your event
 *      category {required | string} give a category to your event
 *      events {optional | array/string} Specify any events that will trigger an analytic tracking.
 *                                Defaults to "click"
 */
HUMMEDIA_DIRECTIVES
    .directive('analytics', ['analytics', function(analytics){
            return {
                restrict: 'A',
                replace: false,
                compile: function(element, attrs, transclude) {

                    var DEFAULT_EVENT = 'click';

                    return function postLink(scope, iElement, iAttrs, controller) {

                        var options = scope.$eval(iAttrs['analytics']),
                            required_attrs = ['label','category'];
                        
                        angular.forEach(required_attrs, function(a) {
                            if(!options[a]) {
                                throw "Missing attribute or value for '" + a + "'";
                            }
                        });

                        var category = options['category'],
                            label    = options['label'],
                            events   = options['events'] || DEFAULT_EVENT;

                        var attachEvent = function(eventName) {
                            element.bind(eventName, function(){
                                analytics.event(category, eventName, label);
                            });
                        };
                        
                        if(events instanceof Array) {   
                            angular.forEach(events, function(event){
                                attachEvent(event);
                            });
                        }
                        else
                        {
                            attachEvent(events);
                        }
                    };
                }
            };
    }]);
