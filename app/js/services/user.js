/**
 * Lets us get user information.
 * 
 * @TODO: Set up a websocket with the API to see when the user logs in or disconnects
 * 
 * Properties:
 *  {Object} data -- contains information about the logged-in user, if they are logged in.
 *  {bool} exists -- whether or not the user is logged in.
 *  {bool} canCreate -- whether or not the user has the ability to create resources
 *  {bool} netIDRequired -- Whether or not the user needs to link their account with a NetID to continue
 *  
 * Methods:
 *  {void} prompt [BOOL toggle] -- opens a modal window prompting the user to log in.
 *                                 if toggle is set to true, this will close the window
 *                                 if already open
 *
 * {void} closePrompt -- closes the prompt window if it exists
 * {void} signin -- redirects the user to the API's sign-in page
 * {void} googleSignin -- same as signin, but with Google
 * {http promise} logout -- logs out the current user
 * {http promise} checkStatus -- forces a refresh of the user's data
 */
HUMMEDIA_SERVICES.factory('user', ['$http', 'appConfig', '$location', '$templateCache', '$compile', '$rootScope', '$window', function($http, config, $location, $templateCache, $compile, $scope, $window) {
     "use strict";
     
     var _exists = false;
     var _netIDRequired = false;
     var _promptedToLink = false;
     var _data = {};
     var user = {};

     Object.defineProperty(user, 'exists', {
         enumerable: true,
         get: function() {
             return _exists;
         }
     });

     Object.defineProperty(user, 'netIDRequired', {
         enumerable: true,
         get: function() {
            return _netIDRequired;
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
                return user.exists && (user.data.role == "faculty" || user.data.superuser);
          }
     });

     user.closePrompt = function() {
         $('#graywall').remove();
         $("#login").remove();
         $('html').removeClass('noscroll');
     }
     
     user.prompt = function(toggle) {
         if(user.exists)
             return;
         
         if($("#login").length) {
             if(toggle === true) {
                this.closePrompt();
             }
             return;
         }

         $('html').addClass('noscroll');
         $http.get('partials/login.html', {cache:$templateCache}).success(function(data){
             $("#view").append($compile(data)($scope));
         });
     };
     
     user.signin = function() {
        $window.location = config.apiBase + "/account/login?r=" + $location.absUrl();
     };
     
     user.googleSignin = function() {
         $window.location = config.apiBase + "/account/login/google?r=" + $location.absUrl();
     };
     
     user.logout = function() {
         var promise = $http.get(config.apiBase + "/account/logout");
         _exists = false;
         _data = {};
         return promise;
     };

     user.checkStatus = function() {
        var promise = $http.get(config.apiBase + '/account/profile');
        promise.success(function(data) {
                _data = data;
                if(user.data.username !== null) {
                    _exists = true;
                }
                // user logged in through oAuth provider but no associated NetID available
                if(!_promptedToLink && user.data.oauth && user.data.username === null) {
                    _netIDRequired = true;
                    _promptedToLink = true;
                    user.prompt();
                }
        });
        return promise;
     };
     
     // only the service should be able to update the user's information
     Object.freeze(user);
     
     // kick things off.
     (function(){
        var statusDelay = 30*1000; // how often to poll (if websockets are unavailable) to see user's status
        user.checkStatus(function(){
            setTimeout(user.checkStatus, statusDelay);
        });
     })();
     
     return user;
}]);
