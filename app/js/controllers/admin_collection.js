'use strict';
function AdminCollectionCtrl($scope, Collection, Video, $routeParams, $location, Course) {
    
    //Simple display logic
    
    $scope.togglePanel = function(panel_id, toggle_id){
        $(panel_id).slideToggle('slow');
        $(toggle_id).toggleClass("icon-plus icon-minus");
    }
    
    //Set variables
    $scope.collections = Collection.query();
    $scope.semesters = Course.getSemesterArray();
    $scope.course_departments = Course.getCourseDepartments();
    
    $scope.tinymceOptions = {
        plugins: "link",
        toolbar: "bold italic | link image",
        menubar: false
    };

    //Watch the route params and keep $scope.collection_data updated
    $scope.$watch(function(){return $routeParams.id;}, function(){
        $scope.id = $routeParams.id;
        if($scope.id){
            $scope.collection_data = Collection.get({identifier:$routeParams.id});        
        }
    });
    

    
    
    $scope.toggleCreateCollection = function(){
        $scope.createMode = true;
        $scope.collection_data = {};
        $location.search({'create':'true'});
    }
    
    $scope.inCreateOrEditMode = function(){
        if($scope.collection_data || $scope.createMode){
            return true;
        }else{
            return false;
        }
    }
    
    $scope.showCollection = function(pid){
        $location.search({'id':pid});
        $scope.createMode = false;
    };
    
//    $scope.$watch(function returnCourseInformation(){
//            return [$scope.course_department, $scope.course_number, $scope.section_number, $scope.collection_data.semester];
//        }, function updateCourseInformation(newval, oldval){
//            $scope.course_string = Course.courseFieldsToString(newval[0], newval[1], newval[2], newval[3]);
//        },true
//    );
    
    
    $scope.annotate = function(pid, collection_pid) {
        $location.path('/video/annotate/' + pid).search({'collection': collection_pid});
    }

    $scope.deleteCollection = function(pid){
        // using bracket notation to enable minification with the word "delete" 
        Collection['delete']({"identifier":pid});
        $scope.collection_data = null;
        $scope.collections = $scope.collections.filter(function(a){return a.pid !== pid;});
        $location.search({});
    };
    
    var createCollection = function(){
        
        $scope.course_string = Course.courseFieldsToString($scope.course_department, $scope.course_number, $scope.section_number, $scope.collection_data.semester);

        
        var params = new Object();
            params['dc:title'] = $scope.collection_data['dc:title'];
            params['dc:description'] = $scope.collection_data['dc:description'];
            params['faculty_authorized'] = $scope.collection_data['faculty_authorized'];
            params['semester'] = $scope.collection_data['semester'];
        Collection.save(params, function(data){
            params['pid'] = data.pid;
            $scope.collections.push(params);
            $scope.showCollection(data.pid);
        });        
    };
    
    //! Make this function work for saving changes as well as new collections
    $scope.saveChanges = function(){
        if($scope.collection_data.pid){
            updateCollection();
        }else{
            createCollection();
        }
//        var newtitle = $('#collectioninfo_title').prop("value"),
//            newdescription = $scope['collection_data']['dc:description'];
//        var params = new Object();
//            params['dc:title'] = newtitle;
//            params['dc:description'] = newdescription;
//        
//        Collection.update({"identifier":pid}, params);
//        for(var i=0; i<$scope.collections.length; i++) {
//                if(pid===$scope.collections[i]['pid']){
//                    $scope.collections[i]['dc:title'] = newtitle;
//                    $scope.collections[i]['dc:description'] = newdescription;
//                }
//        }
//        $scope['collection_data']['dc:title'] = newtitle;
//        $scope.editCollection();
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
}
// always inject this in so we can later compress this JavaScript
AdminCollectionCtrl.$inject = ['$scope', 'Collection', 'Video', '$routeParams', '$location', 'Course'];
