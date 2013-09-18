window.HUMMEDIA_SERVICES
    /**
     * METHODS:
     *  pageView(url) tracks a view of a specific URL
     *  event(category, action, opt_label, opt_value, opt_noninteraction)
     *  See https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
     *  for all parameters.
     */  
    /**
     *  @license
     *  Some credit is due to Harlan Dobrev for the Google Analytics integration with Angular
     *  http://stackoverflow.com/a/12262820/390977
     */
    .service('analytics', ['appConfig', '$rootScope', '$location', function(appConfig, $rootScope, $location){
        window._gaq = window._gaq || [];
        (function(){
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
        
        _gaq.push(['_setAccount', appConfig.googleAnalyticsKey]);
        
        if(appConfig.debugMode) {
            _gaq.push(['_setAllowLinker',true]);
            _gaq.push(['_setDomainName', 'none']);
        }
        
        this.pageView = function(url) {
            if(typeof url !== "string") {
                url = $location.url();
            }
            _gaq.push(['_trackPageview', url]);
        };
        
        this.event = function()
        {
            var event = ['_trackEvent'].concat(Array.prototype.slice.call(arguments));
            _gaq.push(event);
        };
        
        var that = this;
        // automatically track a page view when the page changes
        $rootScope.$on('$viewContentLoaded', function(){that.pageView();});
    }]);
