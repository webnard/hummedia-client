'use strict';
function LoginCtrl($scope,$location) {
    /**
     * If already logged in
     * @TODO
     */
    if(false) {
        $location.path('/');
        return;
    }
};

LoginCtrl.$inject = ['$scope','$location'];

// add Google authentication
// see https://developers.google.com/+/web/signin/
(function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();