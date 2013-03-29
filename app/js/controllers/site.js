
'use strict';
function SiteCtrl($scope, $http, appConfig) {
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    var tag = document.createElement("img");
    var img_url;
    tag.onload = function() {
        setTimeout(function(){
            $scope.style = {
                "background-image": "url(" + img_url + ")",
                "opacity": 1
            };
            $scope.$digest();
        }, 500);
    };
    
    // sets up a default background image if something breaks with Flickr
    var defaultImage = function() {
        img_url = tag.src = 'img/beetle-rock.jpg';
        $scope.image_title = "Beetle Rock Sunset #1, Sequoia National Park";
        $scope.img_profile = "http://www.flickr.com/photos/flatworldsedge/7874109806/";
        $scope.img_username = "H Matthew Howarth";
        $scope.license = "Attribution-ShareAlike License";
        $scope.copyright = "http:\/\/creativecommons.org\/licenses\/by-sa\/2.0\/";
    };
    
    var photo_ids = ['510175383','30950009', '2685376029', '5803011292', '7608871682', '3814815269', '202917381', '3438611399', '5912999510', '6026030129', '6231476868', '537896598','6159637428'];
    //var photo_ids = ['7608871682'];
    var imagecount = photo_ids.length;
    var num = getRandomInt(0,imagecount-1);
    var photo_id = photo_ids[num];
    $http.jsonp("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+appConfig.flickrKey+"&photo_id="+photo_id+"&format=json&jsoncallback=JSON_CALLBACK")
    .success(function(data){
        try {
            var photo = data.photo;
            var farm_id = photo.farm;
            var server_id = photo.server;
            var id = photo.id;
            var secret = photo.secret;
            img_url = "http://farm"+ farm_id + ".staticflickr.com/" + server_id + "/" + id +"_" + secret + "_b.jpg";
            
            tag.src = img_url;
            
            $scope.image_title = photo['title']['_content'];
            $scope.img_profile = photo['urls']['url']['0']['_content'];
            
            var license_request = $http.jsonp("http://api.flickr.com/services/rest/?method=flickr.photos.licenses.getInfo&api_key="+appConfig.flickrKey+"&format=json&jsoncallback=JSON_CALLBACK");
            
            license_request.success(function(data){
               data.licenses.license.forEach(function(license){
                   if(license.id === photo.license) {
                       $scope.license = license.name;
                       $scope.copyright = license.url;
                   }
               });
            });
            
            var owner = photo.owner;
            if(owner.hasOwnProperty('realname') && owner.realname !==''){
                    $scope.img_username = owner.realname;
                }
                else{
                    $scope.img_username = owner.username;
                };
        }catch(error){
            defaultImage();
            throw error;
        }
    }).error(defaultImage);

    
}
// always inject this in so we can later compress this JavaScript
SiteCtrl.$inject = ['$scope', '$http', 'appConfig'];
