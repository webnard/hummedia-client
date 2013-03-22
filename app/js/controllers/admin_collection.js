'use strict';
function AdminCollectionCtrl($scope, Collection, Video, $routeParams) {
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
        Collection.update({"identifier":pid}, params);
        $scope.editCollection();
    };
    $scope.addVideo = function(collectionid){
        var pid;
        $(document).ready(function() {
            pid = $('#addvideopid').prop("value");
        });
        var video_data=Video.get({identifier:pid}, function(){
            var isMemberOfs = video_data['ma:isMemberOf'];
            var newcollection = {"@id": collectionid};
            isMemberOfs.push(newcollection);
            var params = new Object();
                params['ma:isMemberOf'] = isMemberOfs;            
            Video.update({"identifier":pid}, params);
        });            
    };
    $scope.deleteVideo = function(pid){
        console.log(pid);
    };
}
// always inject this in so we can later compress this JavaScript
AdminCollectionCtrl.$inject = ['$scope', 'Collection', 'Video', '$routeParams'];