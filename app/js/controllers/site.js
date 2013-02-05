
'use strict';
function SiteCtrl($scope, $http) {
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    var photo_ids = ['510175383','30950009', '2685376029', '5803011292', '7608871682'];
    //var photo_ids = ['7608871682'];
    var imagecount = photo_ids.length;
    var num = getRandomInt(0,imagecount-1);
    var photo_id = photo_ids[num];
    console.log(photo_id);
    $http.jsonp("http://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=b87e337e9091368d25a03a475c8836b2&photo_id="+photo_id+"&format=json&jsoncallback=JSON_CALLBACK")
    .success(function(data){
        var photo = data.photo;
        console.log(photo);
        var farm_id = photo.farm;
        var server_id = photo.server;
        var id = photo.id;
        var secret = photo.secret;
        $scope.img_url = "http://farm"+ farm_id + ".staticflickr.com/" + server_id + "/" + id +"_" + secret + "_b.jpg";
        $scope.image_title = photo['title']['_content'];
        $scope.img_profile = photo['urls']['url']['0']['_content'];
        var owner = photo.owner;
        if(owner.hasOwnProperty('realname') && owner.realname !==''){
                $scope.img_username = owner.realname;
            }
            else{
                $scope.img_username = owner.username;
            };
            
    });
}
// always inject this in so we can later compress this JavaScript
SiteCtrl.$inject = ['$scope', '$http'];