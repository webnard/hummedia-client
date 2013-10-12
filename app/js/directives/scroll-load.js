"use strict";
HUMMEDIA_DIRECTIVES
.directive('scrollLoad', [function(){
    return function($scope, elm, attrs) {
        var interval = setInterval(setSrc, 500);

        function setSrc(scrollY) {
            if( elm.offset()['top'] - window.scrollY <= $(window).height() ) {
                elm[0].src = attrs['scrollLoad'];
                clearInterval(interval);
            }
        };

        $scope.$on('$destroy', function() {
            clearInterval(interval);
        });

    }
}]);
