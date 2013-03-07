window.HUMMEDIA_SERVICES
    /**
     * METHODS:
     *  pageView(url) tracks a view of a specific URL
     *  event(category, action, opt_label, opt_value, opt_noninteraction)
     *  See https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide#SettingUpEventTracking
     *  for all parameters
     */
    .service('analytics', ['appConfig', function(appConfig){
        window._gaq = window._gaq || [];
        (function(){
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();
        _gaq.push(['_setAccount', appConfig.googleAnalyticsKey]);
        
        if(!appConfig.debugMode) {
            _gaq.push(['_setAllowLinker',true]);
            _gaq.push(['_setDomainName', 'none']);
        }
        _gaq.push(['_trackPageview']);
        
        this.pageView = function(url) {
            _gaq.push(['_trackPageview', url]);
        };
        
        this.event = function()
        {
            var event = ['_trackEvent'].concat(Array.prototype.slice.call(arguments));
            _gaq.push(event);
        };
    }]);