'use strict';


// Declare app level module which depends on filters, and services
angular.module('hummedia', ['hummedia.config','hummedia.filters', 'hummedia.services', 'hummedia.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/search', {templateUrl: 'partials/search/search.html', controller: SearchCtrl});
    $routeProvider.when('/search/:query', {templateUrl: 'partials/search/search.html', controller: SearchCtrl});
    $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: MyCtrl1});
    $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: MyCtrl2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]).
  config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
  }]).
  config(['$httpProvider', function($httpProvider) {
    /**
     * @todo This does not currently work with backend
     */
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  }]);
