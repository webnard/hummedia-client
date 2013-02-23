/**
  Contains configuration data for connecting to the API.
  
  WARNING: Do not modify this file directly. Make a copy of it into
  config.local.js instead. Any identical constant names in config.local.js
  will override those of this configuration.
**/
'use strict';
if(HUMMEDIA_CONFIG === undefined) {
  var HUMMEDIA_CONFIG = angular.module('hummedia.config', [])
}
HUMMEDIA_CONFIG.
  value('apiBase', 'https://zelda.byu.edu/api/v2/').
  value('flickrKey', 'your key here').
  factory('appConfig', ['apiBase','flickrKey', function(apiBase, flickrKey) {
    return {
      apiBase: apiBase,
      flickrKey: flickrKey
    };
}]);