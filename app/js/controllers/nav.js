'use strict';
function NavCtrl($scope, user, config) {
    $scope.user = user;
    $scope.showAdminMenu = false;
    $scope.showLogin = true;
    $scope.debug = config.debugMode;

    $scope.$watch(function(){ return !user.exists && !user.netIDRequired }, function(show) {
        $scope.showLogin = show;
    });
    $scope.toggleAdmin = function() {
        $scope.showAdminMenu = !$scope.showAdminMenu;
    };
};
NavCtrl.$inject = ['$scope','user','appConfig'];
