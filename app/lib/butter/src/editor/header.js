/* This Source Code Form is subject to the terms of the MIT license
 * If a copy of the MIT license was not distributed with this file, you can
 * obtain one at https://raw.github.com/mozilla/butter/master/LICENSE */

define([ "ui/widget/tooltip" ], function( Tooltip ) {

  return function( editorAreaDOMRoot, editorModule ) {
    var _popcornButton = editorAreaDOMRoot.querySelector( ".butter-editor-header-popcorn" );

    var _focusMap = {
      "plugin-list": _popcornButton
    };

    var _currentFocus;

    function openPluginList() {
      editorModule.openEditor( "plugin-list" );
    }

    this.setFocus = function( editorName ) {
      var focusCandidate = _focusMap[ editorName ];
      if ( _currentFocus ) {
        _currentFocus.classList.remove( "butter-active" );
      }
      if ( focusCandidate ) {
        focusCandidate.classList.add( "butter-active" );
        _currentFocus = focusCandidate;
      }
    };

    Object.defineProperty( this, "focusMap", {
      enumerable: true,
      writeable: false,
      configurable: false,
      get: function() {
        return _focusMap;
      }
    });

    this.views = {
      unSaved: function() {
      },
      saved: function() {
      },
      enablePlugins: function() {
        _popcornButton.classList.remove( "butter-editor-btn-disabled" );
        _popcornButton.addEventListener( "click", openPluginList, false );
      },
      disablePlugins: function() {
        _popcornButton.classList.add( "butter-editor-btn-disabled" );
        _popcornButton.removeEventListener( "click", openPluginList, false );
      }
    };

  };

});
