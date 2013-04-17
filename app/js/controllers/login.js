'use strict';
function LoginCtrl($scope, user) {
    $scope.user = user;
    $scope.hideLogin = function(){
        $('#login').remove();
        $('#graywall').remove();
    };
};

LoginCtrl.$inject = ['$scope', 'user'];
