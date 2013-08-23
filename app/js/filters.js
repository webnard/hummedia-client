'use strict';

/* Filters */

angular.module('hummedia.filters', [])
.filter('language', ['language', function (language) {
    return function(n){
        return language.nameFromCode(n)
    };
}])
// translates strings into the user's current locale
.filter('tr', function () {
    return function(n) {
	    return n;
    }
});
