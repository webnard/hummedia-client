function AdminUserCtrl($scope, account) {
    "use strict";
    $scope.user = null;
    $scope.users =  account.search();

    $scope.setUser = function(user) {
        $scope.user = user;
    };
};
AdminUserCtrl.$inject = ['$scope','Account'];
