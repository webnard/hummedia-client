"use strict";
HUMMEDIA_DIRECTIVES
    /**
     * NOTE: This is a dummy directive.  I don't think it works, and even if it did, it doesn't do anything.  
     * However, the file name seems right and I think it needs to exist?
     */
    .directive('annotationChange', function(){
	return function($scope, element, attributes) {
            var expression = attributes.annotationChange;
            if(!$scope.$eval( expression)){
                alert("element.hide()");
            }
            
            
            $scope.$watch(
                expression,
                function( newValue, oldValue ) {

                    // Ignore first-run values since we've
                    // already defaulted the element state.
                    if ( newValue === oldValue ) {
                        
                        alert("Return");
                        return;
                    }

                    // Show element.
                    if ( newValue ) {
                        alert("Show element");
                    // Hide element.
                    } else {
                        alert("Hide element");
                    }
                }
            );
	}
        return({
             link: link,
             restrict: "A"
        });
    });
