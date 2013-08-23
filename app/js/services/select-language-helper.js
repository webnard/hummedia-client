/**
 * Used in the selectLanguage and selectLanguageMulti directives.
 * Couldn't find an way to easily combine the two, as each had slightly different templates.
 * 
 * @author Ian Hunter
 * @see selectLanguage and selectLanguageMulti directives
 */
"use strict";
HUMMEDIA_SERVICES.
    service('selectLanguageHelper', ['language', function(language){
        var linkFn = function(scope, iElement, iAttrs, controller) {

            if(iAttrs.hasOwnProperty('langExists')) {
                scope.__languages = language.list;
            }
            else
            {
                scope.__languages = language.all;
            }
            
            var callback = iAttrs['langCallback'];
            
            if(callback && typeof scope[callback] === "function") {
                scope[callback]();
            }
        };
        
        return {
            linkFn: linkFn
        };
    }]);
