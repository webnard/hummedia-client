'use strict';
function NavCtrl($scope, user) {
    console.log(user);
    $scope.user = user;
    user.signin();
};
NavCtrl.$inject = ['$scope','user'];