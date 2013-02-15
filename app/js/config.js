/**
  Contains configuration data for connecting to the API.
  
  WARNING: Do not modify this file directly. Make a copy of it into
  config.local.js instead. Any identical constant names in config.local.js
  will override those of this configuration.
**/
'use strict';
angular.module('hummedia.config', []).
  constant('appConfig', {
      apiBase: 'https://zelda.byu.edu/api/v2/',
      flickrKey: 'your key here'
  });