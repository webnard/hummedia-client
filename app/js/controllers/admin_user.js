function AdminUserCtrl($scope, account) {
    "use strict";
    $scope.users =  account.search();
};
AdminUserCtrl.$inject = ['$scope','Account'];
