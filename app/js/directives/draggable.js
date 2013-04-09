"use strict";
HUMMEDIA_DIRECTIVES

/**
 * @TODO
 * This is kind of highly specific
 * but it was the easiest way to get this to work with dynamically created elements
 */
.directive('draggable', function(){
    return function($scope, elm, attrs) {
        $(elm).draggable({
            containment: 'body', helper: 'clone',
            drag: function(event, ui) {
                $('#droppable').css("background-color", "lightblue");
                $('#defaultdrop').hide();
                $('#dragdrop').show();
                ui.helper.addClass("minidraggable");
            },
            stop: function() {
                $('#droppable').css("background-color", "white");
                $('#dragdrop').hide();
                $('#defaultdrop').show();
            }
        });
    };
});