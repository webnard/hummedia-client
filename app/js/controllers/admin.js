'use strict';
function AdminCtrl($scope, $routeParams, Collection, $location) {
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
        $location.path("/admin/collection/" + pid);
    };
    $scope.showCreateCollection = function(){
        $(document).ready(function() {
            $('#createcollection').slideToggle('slow');
            $('#collToggle').toggleClass("icon-plus icon-minus");
        });
    };
}
// always inject this in so we can later compress this JavaScript
AdminCtrl.$inject = ['$scope', '$routeParams', 'Collection', '$location'];