'use strict';

/**
 * Allows the user to change their locale
 */
function LanguageCtrl($scope) {
    $scope.language = 'es';
    
    $scope.languages = [{label: "English", value: "en"}, {label: "Español", value: "es"}];
};
LanguageCtrl.inject = ['$scope'];