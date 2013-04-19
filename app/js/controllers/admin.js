function AdminCtrl($scope, user) {
    'use strict';

    // prompt login if the user is not logged in
    $scope.$watch(function(){return user.exists;}, function(allowed) {
        if(!allowed)
            user.prompt();
        else
            user.closePrompt();
    });
};
// always inject this in so we can later compress this JavaScript
AdminCtrl.$inject = ['$scope','user'];
