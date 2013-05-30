'use strict';

/**
 * Allows the user to change their locale
 */
function LanguageCtrl($scope, language) {
    $scope.language = language;
    
    // toggles the language label's value on and off quickly
    $scope.flash = function() {
        angular.element('#nav-language-label').hide();
        setTimeout(function(){
           angular.element('#nav-language-label').show(); 
        },1);
    };
};
LanguageCtrl.$inject = ['$scope','language'];
