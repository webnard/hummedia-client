'use strict';
function NavCtrl($scope, user) {
    $scope.user = user;
};
NavCtrl.$inject = ['$scope','user'];