'use strict';

/**
 * Allows the user to change their locale
 */
function LanguageCtrl($scope, language) {
    $scope.language = language.current;
    $scope.languages = language.list;
    
    $scope.$watch('language', function(val) {
	language.current = val;
    });
};
LanguageCtrl.inject = ['$scope','language'];