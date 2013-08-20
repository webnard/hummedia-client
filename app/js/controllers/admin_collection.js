'use strict';
function AdminCollectionCtrl($scope, Collection, Video, $routeParams, $location) {
    
    //Faculty Authorization
    $scope.faculty_checkbox = false;
    
    var getSemesterObject = function(month, year){
        var int;
        var name;
        
        if(month>=1 && month<=4){
            int = year*10+1;
            name = "Winter " + year;
        }else if(month>=5 && month<=6){
            int = year*10+3;
            name = "Spring " + year;
        }else if(month>=7 && month<=8){
            int = year*10+4;
            name = "Summer " + year;
        }else if(month>=9 && month<=12){
            int = year*10+5;
            name = "Fall " + year;
        }
        return {int: int, name: name};
    };
    
    var getNextTerm = function(semester){//Takes a semester object and returns a semester object for the next term
        var int;
        var name;
        
        //Turn the semester int into a string
        var i = semester.int + "";
        //Get the last digit of the semester int
        var term = i.substring(i.length-1);
        term = parseInt(term);
        //Get the first digits for the yar
        var year = (semester.int-term)/10;        
        
        var new_term = term+1;
        
        if(new_term==2){
            int = semester.int+2;
            name = "Spring " + year;
        }else if(new_term==4){
            int = semester.int+1;
            name = "Summer " + year;
        }else if(new_term==5){
            int = semester.int+1;
            name = "Fall " + year;
        }else if(new_term==6){
            int = (year+1)*10 + 1;
            name = "Winter " + (year+1);
        }
        return {int: int, name: name};
    };
    
    $scope.getSemesterArray = function(){//returns an array of 4 semester objects starting from the current term
        var d = new Date();
        var year = d.getFullYear();
        var month = d.getMonth();
        
        var semesters = [];        
        var semester = getSemesterObject(month, year);
        
        for(var i=0; i<4; i++){
            semesters.push(semester);
            semester=getNextTerm(semester);
        }
        return semesters;
    }
            
    $scope.semesters = $scope.getSemesterArray();    
    
    //Set the semester to the current semester after all the others load
    setTimeout(function(){
        $('#semester_select').val($scope.semesters[0].int);
    }, 0);
        
    $scope.tinymceOptions = {
        plugins: "link",
        toolbar: "bold italic | link image",
        menubar: false
    }

    $scope.newCollection = function(){        
        if($scope.newtitle === ''){$scope.newtitle = 'New Hummedia Collection';}
        var params = new Object();
            params['dc:title'] = $scope.newtitle;
            params['dc:description'] = $scope.newdescription;
            params['faculty_authorized'] = $scope.authorization_checkbox;
            params['semester'] = $scope.semester_select;
        Collection.save(params, function(data){
            params['pid'] = data.pid;
            $scope.collections.push(params);
        });        
        $scope.newtitle = '';
        $scope.newdescription ='';
        $scope.authorization_checkbox = false;
    };
    
    $scope.showCollection = function(pid){
        $location.search({'id':pid});
    };
    
    $scope.showCreateCollection = function(){
        $('#createcollection').slideToggle('slow');
        $('#collToggle').toggleClass("icon-plus icon-minus");
    };
    
    $scope.collections = Collection.query();
    
    $scope.$watch(function(){return $routeParams.id;}, function(){
        $scope.id = $routeParams.id;
        if($scope.id){
            $scope.collection_data = Collection.get({identifier:$routeParams.id});
        }
    });
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
    $scope.editCollection = function(){
        $('#collectioninfo_title').prop("value", $scope['collection_data']['dc:title']);
        $('#collectioninfo_description').prop("value", $scope['collection_data']['dc:description']);
        $('#editbutton').toggleClass('depressed');
        $('#mce_6').toggle();
        if($scope.isEditable === true){
            $('#inputId').attr('readonly', true);
            $scope.isEditable = false;
            $('#description-cover').show();
        }else{
            $('#inputId').attr('readonly', false);
            $scope.isEditable = true;
            $('#description-cover').hide();
        }
    };
    
    $scope.saveChanges = function(pid){
        var newtitle = $('#collectioninfo_title').prop("value"),
            newdescription = $scope['collection_data']['dc:description'];
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
