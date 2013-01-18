'use strict';

/* Filters */

angular.module('hummedia.filters', [])
.filter('language', function () {
    return function(n){
        switch(n)
        {
            case 'de':
                return 'German';
            case 'pt':
                return 'Portuguese';
            case 'en':
                return 'English';
            case 'zh':
                return 'Chinese';
            default:
                return n;
        }
    };
});