'use strict';
function VideoCtrl($scope, $routeParams, Video, Annotation, appConfig) {
    
	var annotation_ids = {}, // PID-keyed arrays of track event IDs, as specified by Popcorn
        pop, // the Popcorn object, initialized under Video.get below
        annotations_enabled = true;
        
    $scope.has_optional_annotations = false;

  //Code to style the page correctly
  //
    function resizeView(){
        var new_height = $(window).height()-$('#nav-wrapper').height();
        $('#view').css("height", new_height);
        $('#annotations_wrapper').css('top', $('#nav-wrapper').height());
    }

    //Initialize resized view
    resizeView();
    window.addEventListener("resize", resizeView);
    
    //Add page-specific styles
    $('html').addClass('video-page');
    
    //Event handler for leaving the page
    $("#video-wrapper").on("remove", function () {
        window.removeEventListener("resize", resizeView);
        $('#view').css('height','');
        $('html').removeClass('video-page');
    });
  /////////////////////////////////////////////
    
    /**
     * Turns off an annotation, if annotation.required exists
     * @param {Annotation} annotation
     */
    function disableAnnotation(annotation) {
        if(annotation.required) {
            throw new Error("Cannot disable a required annotation");
        }
        
        var index = annotation.pid;
        
        // make sure it's ready / exists
        if(!pop instanceof Popcorn) {
            throw new Error("Popcorn player does not exist yet");
        }
        
        // the annotation does not exist
        if(annotation_ids[index] === undefined) {
            return;
        }
        
        annotation_ids[index].forEach(function(id) {
            pop.removeTrackEvent(id);
        });
        delete annotation_ids[index];
    };
    
    function enableAnnotation(annotation) {
        if(!pop instanceof Popcorn) {
            throw new Error("Popcorn player does not exist yet");
        }
        var index = annotation.pid;
        
        if(annotation_ids[index] !== undefined) {
            throw new Error("Cannot enable the same annotation more than once.");
        }
        
        
        var ids = [];
        annotation.media[0].tracks.forEach(function(element){
            element.trackEvents.forEach(function(element){
                switch(element.type) {
                    /** @TODO: this check should be replaced by using these values by default on the API **/
                    case 'link':
                        element.type = element.popcornOptions.service;
                        element.popcornOptions.key = appConfig.youtubeKey; /**@TODO: should this be replaced by a generic 'googleKey'? **/
                        break;
                    
                    /** @TODO: these need to be altered in the database **/
                    case 'pause':
                        element.type = 'pausePlugin';
                        break;
                    case 'mute':
                        element.type = 'mutePlugin';
                        break;
                }

                /** @TODO: if the end field is absent, it probably should be fixed in the database **/
                if(isNaN(parseFloat(element.popcornOptions.end))) {
                    element.popcornOptions.end = 0;
                }

                if(typeof pop[element.type] !== 'function') {
                    if(appConfig.debugMode) {
                        throw "Popcorn plugin type '" + element.type + "' does not exist";
                    }
                }
                pop[element.type](element.popcornOptions);
                ids.push(pop.getLastTrackEventId());
            });
        });
        annotation_ids[index] = ids;
    }
    
    $scope.toggleAnnotations = function() {
        $scope.annotations.forEach(function(a) {
            if(a.required) {
                return; // this can't be toggled; it should always be on
            }
            
            if(annotations_enabled) {
                annotations_enabled = false;
                disableAnnotation(a);
            }
            else
            {
                annotations_enabled = true;
                enableAnnotation(a);
            }
        });
    };        
    
    $scope.toggleDescription = function() {
        $('#description').slideToggle();
        $('#description-toggle-icon').toggleClass('icon-minus');
        $('#description-toggle-icon').toggleClass('icon-plus');
    };
    
    $scope.video = Video.get({identifier:$routeParams.id}, function loadPopcorn(){
        
        var required_annotation = $scope.video['ma:isMemberOf'].restrictor;
        pop = Popcorn.smart("video", $scope.video.url);
        
        if($routeParams.collection === undefined && !required_annotation) {
            // we're done here. there are no annotations.
            return;
        }
        
        /**
         * callback function for after we call methods on the Annotation resource
         * enables each individual annotation
         */
        var _loadEachAnnotation = function(){
            // helper function for the helper function ;)
            var loadAnnotation = function(data) {
                data.pid = data.media[0].tracks[0].id; // @todo -- ought to be more accessible from the API
                
                if(data.media[0].tracks[0].required) {
                    data.required = true;
                }
                else
                {
                    $scope.has_optional_annotations = true;
                }
                
                enableAnnotation(data);
            };
            
            if($scope.annotations instanceof Array) {
                $scope.annotations.forEach(loadAnnotation);
            }
            else
            {
                loadAnnotation($scope.annotation);
            }
        };
        
        if($routeParams.collection) {
            // we need to load an array of annotations
            var params = {"dc:relation":$scope.video.pid, "collection":$routeParams.collection, "client":"popcorn"};
            $scope.annotations = Annotation.query(params, _loadEachAnnotation);
        }
        else
        {
            // there is only one required annotation; load it
            $scope.annotations = Annotation.get({identifier: required_annotation}, _loadEachAnnotation);
        }
        
        
    });
}
// always inject this in so we can later compress this JavaScript
VideoCtrl.$inject = ['$scope', '$routeParams', 'Video', 'Annotation', 'appConfig'];
