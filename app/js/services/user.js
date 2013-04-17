/**
 * Lets us get user information.
 * 
 * @TODO: Set up a websocket with the API to see when the user logs in or disconnects
 * 
 * Properties:
 *  {Object} data -- contains information about the logged-in user, if they are logged in.
 *  {bool} exists -- whether or not the user is logged in.
 *  
 * Methods:
 *  {void} login -- opens a modal window prompting the user to log in
 */
HUMMEDIA_SERVICES.factory('user', ['$http', 'appConfig', '$location', '$templateCache', '$compile', '$rootScope', function($http, config, $location, $templateCache, $compile, $scope) {
    "use strict";
     
     var _exists = false;
     var _data = {};
     var user = {};

     Object.defineProperty(user, 'exists', {
         enumerable: true,
         get: function() {
             return _exists;
         }
     });
     
     Object.defineProperty(user, 'data', {
         enumerable: true,
         get: function() {
             return _data;
         }
     });
     
     Object.defineProperty(user, 'canCreate', {
          enumerable: true,
          get: function() {
                return user.exists && ["faculty", "admin"].indexOf(user.data['role']) >= 0;
          }
     });
     
     user.prompt = function() {
         if(user.exists)
             return;
         
         if($("#login").length){
             $('#graywall').remove();
             $("#login").remove();
             return;
         }
         $('html').css('overflow-y', 'hidden');
         $http.get('partials/login.html', {cache:$templateCache}).success(function(data){
             
             $("#view").append($compile(data)($scope));
         });
     };
     
     user.signin = function() {
        window.location = config.apiBase + "/account/login?r=" + $location.absUrl();
     };
     
     user.googleSignin = function() {
         window.location = config.apiBase + "/account/login/google?r=" + $location.absUrl();
     };
     
     user.logout = function() {
         window.location = config.apiBase + "/account/logout?r=" + $location.absUrl();
     };
     
     // only the service should be able to update the user's information
     Object.freeze(user);
     
     // kick things off.
     (function(){
        var statusDelay = 30*1000; // how often to poll (if websockets are unavailable) to see user's status
        var checkStatus = function() {
            $http.get(config.apiBase + '/account/profile')
                .success(function(data) {
                    _data = data;
                    if(data.username !== null) {
                        _exists = true;
                    }
                    setTimeout(checkStatus, statusDelay);
                });
        };
        checkStatus();
     })();
     
     return user;
}]);
