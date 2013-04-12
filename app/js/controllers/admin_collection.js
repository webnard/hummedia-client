'use strict';
function AdminCollectionCtrl($scope, Collection, Video, $routeParams, $location) {
    $scope.$watch(function(){return $routeParams.id;}, function(){
        $scope.id = $routeParams.id;
        if($scope.id){
            $scope.collection_data = Collection.get({identifier:$routeParams.id});
        }
    });
    $scope.deleteCollection = function(pid){
        // using bracket notation to enable minification with the word "delete" 
        Collection['delete']({"identifier":pid});
        $scope.collection_data = '';
        $scope.collections.pop();
        $location.search({'id':''});
    };
    $scope.editCollection = function(){
        $(document).ready(function() {
            $('#collectioninfo_title').prop("value", $scope['collection_data']['dc:title']);
            $('#collectioninfo_description').prop("value", $scope['collection_data']['dc:description']);
            $('#editbutton').toggleClass('depressed');
            if($scope.isEditable === true){
                $scope.isEditable = false;
            }else{
                $scope.isEditable = true;
            }
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
        for(var i=0; i<$scope.collections.length; i++) {
                if(pid===$scope.collections[i]['pid']){
                    $scope.collections[i]['dc:title'] = newtitle;
                    $scope.collections[i]['dc:description'] = newdescription;
                }
        }
        $scope['collection_data']['dc:title'] = newtitle;
        $scope['collection_data']['dc:description'] = newdescription;
        $scope.editCollection();
    };
    $scope.addVideo = function(collectionid, videoid){
        var video_data=Video.get({identifier:videoid}, function(){
            var isMemberOfs = video_data['ma:isMemberOf'];
            var newcollection = {"@id": collectionid};
            isMemberOfs.push(newcollection);
            var params = new Object();
                params['ma:isMemberOf'] = isMemberOfs;            
            Video.update({"identifier":videoid}, params);
            //Update scope
            var vid_already_there=false;
            for (var i = 0; i < $scope.collection_data.videos.length; i++) {
                if($scope['collection_data']['videos'][i]['pid']===video_data.pid){
                    vid_already_there=true;
                };
            }
            if(vid_already_there===false){
                $scope['collection_data']['videos'].push(video_data);
            }
        });
    };
    $scope.deleteVideo = function(pid, collectionid){
        var video_data=Video.get({identifier:pid}, function(){
            var isMemberOfs = video_data['ma:isMemberOf'];
            var i;
            var newisMemberOfs = new Array();
            for(i=0; i<isMemberOfs.length; i++) {
                if(collectionid!==isMemberOfs[i]['@id']){
                    newisMemberOfs.push(isMemberOfs[i]);
                }
            }
            var params = new Object();
                params['ma:isMemberOf'] = newisMemberOfs;
            Video.update({"identifier":pid}, params);
            //Remove video from scope
            for (var i = 0; i < $scope.collection_data.videos.length; i++) {
                if($scope['collection_data']['videos'][i]['pid']===pid){
                    $scope['collection_data']['videos'].splice(i,1);
                };
            }
            
        });
    };
    // Drag & Drop stuff
    $("#droppable").droppable({
        drop: function(event, ui){
            $(document).ready(function() {
                var id = ui['helper']['0']['firstChild']['id'];
                $scope.addVideo($routeParams.id, id);   
            });
        }
    });
    
}
// always inject this in so we can later compress this JavaScript
AdminCollectionCtrl.$inject = ['$scope', 'Collection', 'Video', '$routeParams', '$location'];
