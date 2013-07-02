function VideoAnnotationCtrl($scope, Video, $routeParams) {
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
    $scope.video = Video.get({identifier:$routeParams.id}, function(){
        Popcorn.smart("video", $scope.video.url);
        ( function( Butter, EditorHelper ) {
            Butter.init({
              config: {dirs: {css: "clam"}},
              ready: function( butter ) {
                EditorHelper.init( butter );

                butter.listen( "mediaready", function mediaReady() {
                  butter.unlisten( "mediaready", mediaReady );
                  document.querySelector( ".loading-message" ).classList.remove( "show-global" );
                });
              }
            });
        }( window.Butter, window.EditorHelper ) );
    });
  /////////////////////////////////////////////
};
VideoAnnotationCtrl.$inject = ['$scope', 'Video', '$routeParams'];