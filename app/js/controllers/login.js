'use strict';
function LoginCtrl($scope, user) {
    $scope.user = user;
};

LoginCtrl.$inject = ['$scope', 'user'];
