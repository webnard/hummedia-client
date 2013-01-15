'use strict';


// Declare app level module which depends on filters, and services
angular.module('hummedia', ['hummedia.config','hummedia.filters', 'hummedia.services', 'hummedia.directives']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/search', {templateUrl: 'partials/search/search.html', controller: SearchCtrl});
    $routeProvider.when('/search/:query', {templateUrl: 'partials/search/search.html', controller: SearchCtrl});
    //$routeProvider.otherwise({redirectTo: '/view1'});
  }]).
  config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
  }]);