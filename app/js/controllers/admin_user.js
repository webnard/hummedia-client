function AdminUserCtrl($scope, account, language) {
    "use strict";
    
    $scope.languages = language.list;
    $scope.users =  account.search();
    $scope.user = null;
    var copy = null; // used for updating the user list while removing $scope.user

    $scope.setUser = function(user) {
        copy = user;
        $scope.user = user;
    };

    $scope.cancel = function() {
        $scope.user = null;
        copy.$get().success(function(){copy = null});
    }

    // remember, delete is a reserved word, so we need to do this for compilation
    $scope['delete'] = function(user) {
        if(!confirm("Are you sure you want to delete " + user.fullname + "(ID: " + user._id + ")?")) {
            return;
        }
        $scope.users.forEach(function(u, index) {
            $scope.user = null;
            copy = null;
            if(user === u) {
                user.$delete(function() {
                    $scope.users.splice(index,1);
                });
            }
        });
    }

    $scope.update = function() {
        $scope.user.$update();
    }
};
AdminUserCtrl.$inject = ['$scope','Account', 'language'];
