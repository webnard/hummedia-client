'use strict';
function AdminCtrl($scope, $routeParams, Collection) {
    $scope.collections = Collection.query();
    $scope.newCollection = function(){        
        if($scope.newtitle === ''){$scope.newtitle = 'New Hummedia Collection';}
        var params = new Object();
            params['dc:title'] = $scope.newtitle;
            params['dc:description'] = $scope.newdescription;
            params['dc:creator'] = $scope.newcreator;
        Collection.save(params);
        $scope.newtitle = '';
        $scope.newdescription ='';
        $scope.newcreator='';
        $scope.collections = Collection.query();
    };
    $scope.deleteCollection = function(pid){
        Collection.delete({"identifier":pid});
        $scope.collections = Collection.query();
    };
    $scope.showCollection = function(pid){
        $(document).ready(function() {
            window.location.href = "#/admin/collection/"+pid;
        });
    };
}
// always inject this in so we can later compress this JavaScript
AdminCtrl.$inject = ['$scope', '$routeParams', 'Collection'];