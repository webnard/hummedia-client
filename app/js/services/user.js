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
HUMMEDIA_SERVICES.factory('user', ['$http', 'appConfig', function($http, config) {
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
     
     user.signin = function() {
         console.log("Wooo");
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