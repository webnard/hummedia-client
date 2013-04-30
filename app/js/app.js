'use strict';

// Declare app level module which depends on filters, and services
angular.module('hummedia', ['hummedia.config','hummedia.filters', 'hummedia.services', 'hummedia.directives', 'ngLocale']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/search', {title: "Search", templateUrl: 'partials/search/search.html', controller: SearchCtrl, reloadOnSearch: false});
    $routeProvider.when('/', {title: "Humanities Online Media", templateUrl: 'partials/home.html'});
    $routeProvider.when('/collection/:id', {title: "Collection", templateUrl: 'partials/collection.html', controller: CollectionCtrl});
    $routeProvider.when('/admin/collection', {title: "Admin | Collections", admin: true, templateUrl: 'partials/admin-collection.html', controller: AdminCollectionCtrl, reloadOnSearch: false});
    $routeProvider.when('/admin/user', {title: "Admin | Users", admin: true, templateUrl: 'partials/admin-user.html', controller: AdminUserCtrl, reloadOnSearch: false});
    $routeProvider.when('/collection', {title: "Collections", templateUrl: 'partials/collections.html', controller: CollectionsCtrl});
    $routeProvider.when('/developer', {title: "Developer", templateUrl: 'partials/developer.html'});
    $routeProvider.otherwise({redirectTo: '/'});
  }]).
  config(['$locationProvider', function($locationProvider) {
    //$locationProvider.html5Mode(true);
  }]).
  config(['$httpProvider', function($httpProvider) {
      $httpProvider.defaults.headers.patch = {"Content-Type": "application/json"};
      // Intercepts HTTP requests to display API-related errors to the user
      // see http://docs.angularjs.org/api/ng.$http
      $httpProvider.responseInterceptors.push(['$q', 'appConfig', '$rootScope', function($q, appConfig, $rootScope){
          return function(promise) {
              return promise.then(function(response){
                  // success, do nothing
                  return response;
              }, function(response) {
                  // if this is a local request (i.e., not one to flickr or some other service)
                  // then we go back to normal
                  if(response.config.url.indexOf(appConfig.apiBase) !== 0) {
                      return response;
                  }
                  $rootScope.apiError = response.status;
                  return $q.reject(response);
              });
          };
      }]);
  }]).
  /*!
    document title modification partially from jkoreska @ http://stackoverflow.com/a/13407227/390977
  */
  run(['$location', '$rootScope','user', function($location, $rootScope, user) {
      // updates page title on URL change
      $rootScope.$on('$routeChangeSuccess', function(ev, current, previous) {
            $rootScope.title = current.$$route.title;
      });

      // require login for specific pages
      $rootScope.$on('$routeChangeStart', function(ev, current, previous) {
            if(!user.exists && current.$$route.login) {
                $location.path("/");
                setTimeout(function() {
                    user.prompt();
                },1); // make sure this happens AFTER the route is updated
            }
            else if(!user.isAdmin && current.$$route.admin) {
                $location.path("/");
                setTimeout(function(){
                    if(!user.exists) {
                        user.prompt();
                    }
                    else
                    {
                        alert("You are not authorized to view that page.");
                    }
                },1);
            }
      });
  }]);
