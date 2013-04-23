window.HUMMEDIA_SERVICES
    .service('developer', ['appConfig','$http', 'user', function(config, $http, user) {
        var levels = ['B3yGtjkIFz', 'mHxyyRfvO7', 'F3rRTqyfQg'];

        var dev = {
            auth: function(level) {
                if(level < 0 || level > levels.length)
                    console.error("Bad authorization level");

                user.logout().success(function() {
                    $http.get(config.apiBase + "/account/login/authUser", {
                        headers: {
                            Authorization: levels[parseInt(level)]    
                        }
                    }).success(function(){
                        user.checkStatus();
                    });
                });
            }
        };
        Object.freeze(dev);
        return dev;
    }]);
