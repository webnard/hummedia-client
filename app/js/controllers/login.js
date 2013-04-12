'use strict';
function LoginCtrl($scope, user) {
    $scope.user = user;
    $scope.hideLogin = function(){
        $('#login').remove();
        $('#graywall').remove();
    };
};

LoginCtrl.$inject = ['$scope', 'user'];

// add Google authentication
// see https://developers.google.com/+/web/signin/
(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();