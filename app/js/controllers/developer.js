function DeveloperCtrl($scope, developer) {
    $scope.login = function(level) {
        developer.auth(level);
    }
};
DeveloperCtrl.$inject = ['$scope','developer'];
