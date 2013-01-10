'use strict';

/* Controllers */


function MyCtrl1($scope, config) {console.log(config.apiBase)}
MyCtrl1.$inject = ['$scope','appConfig'];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
