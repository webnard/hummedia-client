"use strict";
HUMMEDIA_DIRECTIVES
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
    });