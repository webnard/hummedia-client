
'use strict';
function SiteCtrl($scope, $http) {
    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    $http.jsonp("http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=78516abde0b618f9816d5efb10642812&tags=nature%2C+architecture&license=1&privacy_filter=1&safe_search=1&content_type=1&format=json&jsoncallback=JSON_CALLBACK")
    .success(function(data){
        var images = data.photos.photo;
        var imagecount = images.length;
        var num = getRandomInt(0,imagecount);
        var farm_id = images[num]['farm'];
        var server_id = images[num]['server'];
        var id = images[num]['id'];
        var secret = images[num]['secret'];
        $scope.img_url = "http://farm"+ farm_id + ".staticflickr.com/" + server_id + "/" + id +"_" + secret + "_b.jpg";
        $scope.image = images[num];
        console.log($scope.image);
        //Get Photo Creator data
        $http.jsonp("http://api.flickr.com/services/rest/?method=flickr.people.getInfo&api_key=78516abde0b618f9816d5efb10642812&user_id="+$scope.image.owner+"&format=json&jsoncallback=JSON_CALLBACK")
        .success(function(data){
            if(data.person.hasOwnProperty('realname') && data.person.realname._content!=''){
                $scope.img_username = data.person.realname._content;
            }
            else{
                $scope.img_username = data.person.username._content;
            };
            $scope.img_userprofile = data.person.profileurl._content;
            if(data.person.path_alias==null){
                $scope.img_profile = "http://www.flickr.com/photos/"+data.person.id+"/"+id+"/";
            }else{
                $scope.img_profile = "http://www.flickr.com/photos/"+data.person.path_alias+"/"+id+"/";
            }
            console.log(data);
        });
    });
}
// always inject this in so we can later compress this JavaScript
CollectionCtrl.$inject = ['$scope', '$http'];