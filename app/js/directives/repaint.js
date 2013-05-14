/*
    Forces a repaint on the element on page resize by injecting a small div
    into the element and rapidly flashing its style attributes
*/
HUMMEDIA_DIRECTIVES.
    directive('repaint', ['$window', function($window) {
        "use strict";
        // initialization (only ever happens once)
        var div = $window.document.createElement("div");
        div.style.width = 0;
        div.style.height = 0;
        div.style.zIndex = -1000;
        div.style.position = "absolute";
        div.style.display = "none";
        var w = $($window);

        return function(scope, iElement, iAttrs) {
            iElement.append(div);

            var repaint = function() {
                div.style.display = "block";
                div.offsetHeight;
                div.style.display = "none";
            }
            w.on('resize',repaint);
            scope.$on('$destroy', function() { w.off('resize', repaint) });
        }
    }]);
