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
HUMMEDIA_SERVICES.factory('user', ['$http', 'appConfig', '$location', function($http, config, $location) {
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
        var checkingStatus = false;
        var checkStatus = function() {
            if(checkingStatus) {
                setTimeout(checkStatus, statusDelay);
            }
            
            checkingStatus = true;
            $http.get(config.apiBase + '/account/profile')
                .success(function(data) {
                    checkingStatus = false;
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