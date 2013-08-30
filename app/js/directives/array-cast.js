"use strict";
HUMMEDIA_DIRECTIVES
    /*
     * @TODO: THIS IS CURRENTLY TIED IN DIRECTLY WITH THE ma:hasContributor
     *        FIELD OF THE VIDEO OBJECT (cf. the map methods which transform
     *        values like [{"@id": 123, "name": "JJ Abrams"}] to the string "JJ Abrams"
     *        and vise versa). This needs to be standardized.
     *
     * Transforms newlined values in a textarea into an array and vise-versa
     * Works as a replacement for ngModel
     * 
     * ATTRIBUTES:
     *      arrayCast - the ngModel you want to have set as your array 
     *      ngModel -- a bogus value to update when
     *  
     */
    .directive('arrayCast', ['$compile', function($compile) {

        var count = 0;

        var linkFn = function(scope, iElement, iAttrs, controller) {

            if(!iAttrs['ngModel']) {
                throw "The arrayCast directive requires a bogus ngModel value";
            }
            if(!iAttrs['arrayCast']) {
                throw "Please specify a model via array-cast='propertyname'";
            }

            var model = iAttrs['arrayCast'];
            var placeholder = "__arCast" + count++;

            scope.$watch(model,
                function updateElementValue(val) {
                    if(val instanceof Array) {
                        var ar = val.map(function(a) {
                            return a.name;
                        });
                        iElement.val(ar.join('\n'));
                    }
                }
            );

            // we watch this ngModel value because otherwise digest isn't called when we update our element
            scope.$watch(iAttrs['ngModel'],
                function updateModelValue(val) {
                    var newArray = typeof val == "undefined" ? [""] : val.split('\n');
                    newArray = newArray.map(function(a) {
                            return {"@id": "", "name": a};
                        });

                    scope[placeholder] = newArray;

                    /** @TODO: Super hackish, but otherwise I get an error. **/
                    try {
                        scope.$eval(model + "=" + placeholder);
                    }
                    catch(e) {}
                }
            );
        }

        return {
            link: linkFn
        };
    }]);
