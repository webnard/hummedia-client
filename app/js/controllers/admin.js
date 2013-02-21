'use strict';
function AdminCtrl($scope, $routeParams, Collection) {
    $scope.collections = Collection.query();
    $scope.newCollection = function(){
        Collection.save({
            "dc:title":$scope.newtitle,
            "dc:description":$scope.newdescription,
            "dc:creator":$scope.newcreator
        });
        $scope.newtitle = '';
        $scope.newdescription ='';
        $scope.newcreator='';
        $scope.collections = Collection.query();
    };
    $scope.deleteCollection = function(pid){
        Collection.delete({"identifier":pid});
        $scope.collections = Collection.query();
    };
    $scope.delete2Collection = function(pid){
        var entry = document.getElementById('collection-'+pid);
        var delbutton = document.getElementById('deletebutton');
        $(document).ready(function() {
            $('li').css("background-color","white");
            //$('li').addClass("listvideo");
            entry.style.backgroundColor="lightblue";
            delbutton.onclick = function(){alert(pid);};
            delbutton.disabled = false;
        });
    };
}
// always inject this in so we can later compress this JavaScript
AdminCtrl.$inject = ['$scope', '$routeParams', 'Collection'];