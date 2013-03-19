'use strict';
function AdminCollectionCtrl($scope, Collection, $routeParams) {
    $scope.collection_data = Collection.get({identifier:$routeParams.id});
    if($routeParams.id){
        $(document).ready(function() {
            $('.conditionalbutton').attr("disabled", false);
        });
    }
    $scope.deleteCollection = function(pid){
        Collection.delete({"identifier":pid});
        window.location.href = "#/admin";
    };
    $scope.editCollection = function(){
        $(document).ready(function() {
            $('#collectioninfo_title').prop("value", $scope['collection_data']['dc:title']);
            $('#collectioninfo_description').prop("value", $scope['collection_data']['dc:description']);
            $('.collectioninfo').prop("disabled",!$('.collectioninfo').prop("disabled"));
            $('#editbutton').toggleClass('depressed');
            $('#savebutton').prop("disabled",!$('#savebutton').prop("disabled"));
        });
    };
    $scope.saveChanges = function(pid){
        var newtitle;
        var newdescription;
        $(document).ready(function() {
            newtitle = $('#collectioninfo_title').prop("value");
            newdescription = $('#collectioninfo_description').prop("value");
        });
        var params = new Object();
            params['dc:title'] = newtitle;
            params['dc:description'] = newdescription;
            //params['dc:creator'] = $scope.newcreator;
        Collection.update({"identifier":pid}, params);
        $scope.editCollection();
    };
}
// always inject this in so we can later compress this JavaScript
AdminCollectionCtrl.$inject = ['$scope', 'Collection', '$routeParams'];