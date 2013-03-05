
'use strict';
function SiteCtrl($scope, $http, appConfig) {
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // sets up a default background image if something breaks with Flickr
    var defaultImage = function() {
        $scope.style = {
            "background-image": "url('img/beetle-rock.jpg')"
        };
        $scope.image_title = "Beetle Rock Sunset #1, Sequoia National Park";
        $scope.img_profile = "http://www.flickr.com/photos/flatworldsedge/7874109806/";
        $scope.img_username = "H Matthew Howarth";
    };
    
    var photo_ids = ['510175383','30950009', '2685376029', '5803011292', '7608871682', '3814815269', '202917381'];
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
            $scope.style = {
                "background-image": "url(http://farm"+ farm_id + ".staticflickr.com/" + server_id + "/" + id +"_" + secret + "_b.jpg)"
            };

            $scope.image_title = photo['title']['_content'];
            $scope.img_profile = photo['urls']['url']['0']['_content'];
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
    }).error(defaultImage());

    
}
// always inject this in so we can later compress this JavaScript
SiteCtrl.$inject = ['$scope', '$http', 'appConfig'];