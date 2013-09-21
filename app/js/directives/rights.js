"use strict";

HUMMEDIA_DIRECTIVES
    // Enables the addition and revocation of readers and writers if an
    // ng-model is specified that contains a "read" array and a "write" array
    // e.g.,
    //
    // IN THE CONTROLLER:
    //  scope.mymodel = {read: [], write: []}
    //
    // IN THE PARTIAL:
    //  <div rights ng-model="mymodel"></div>
    .directive('rights', [function() {
        var template = null;
        return {
            restrict: 'A',
            templateUrl: 'partials/rights.html',
            replace: true,
            require: '^ngModel',
            scope: {
                ngModel: '=',
            },
            link: function(scope, iElement, iAttrs, controller) {
                scope.revokeRead = function(netID) {
                    var read = scope.ngModel['read'],
                        idx = read.indexOf(netID);

                    if(idx === -1) {
                        return;
                    }

                    read.splice(idx, 1);
                }
                
                scope.grantRead = function(netID) {
                    if(!netID) {
                        return;
                    }
                    var read = scope.ngModel['read'];
                    if(read.indexOf(netID) !== -1) {
                        return;
                    }
                    read.push(netID);
                };
                
                scope.revokeWrite = function(netID) {
                    var write = scope.ngModel['write'],
                        idx = write.indexOf(netID);

                    if(idx === -1) {
                        return;
                    }

                    write.splice(idx, 1);
                }

                scope.grantWrite = function(netID) {
                    if(!netID) {
                        return;
                    }
                    var write = scope.ngModel['write'];
                    if(write.indexOf(netID) !== -1) {
                        return;
                    }
                    write.push(netID);
                    scope.grantRead(netID);
                }
            }
        }
    }]);
