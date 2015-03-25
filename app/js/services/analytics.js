window.HUMMEDIA_SERVICES
    /**
     * METHODS:
     *  pageView(url) tracks a view of a specific URL
     *  event(category, action, opt_label, opt_value, opt_noninteraction)
     *  -- category can be found from analytics.categories.*
     *  sessionVariable(category, value)
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

        this.userVariable = function(category, value) {
          var catName = null;
          for(var i in this.categories) {
            if(this.categories[i] === category) {
              catName = i;
              break;
            }
          }
          if(catName === null) {
            throw "Category " + category + " does not exist.";
          }

          var toGA = [
            '_setCustomVar',
            category,
            catName,
            value,
            1 // visitor wide
          ];

          _gaq.push(toGA);
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

        this.categories = {
          "Role": 1
        };
        
        var that = this;
        // automatically track a page view when the page changes
        $rootScope.$on('$viewContentLoaded', function(){that.pageView();});
    }]);
