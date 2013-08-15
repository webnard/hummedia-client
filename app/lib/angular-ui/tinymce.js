/*!
The MIT License

Copyright (c) 2012 the AngularUI Team, http://angular-ui.github.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
/**
 * Binds a TinyMCE widget to <textarea> elements.
 */
angular.module('ui.tinymce', [])
  .value('uiTinymceConfig', {})
  .directive('uiTinymce', ['uiTinymceConfig', function (uiTinymceConfig) {
    uiTinymceConfig = uiTinymceConfig || {};
    var generatedIds = 0;
    return {
      require: 'ngModel',
      link: function (scope, elm, attrs, ngModel) {
        require(['tinymce'], function() {
            var expression, options, tinyInstance,
              updateView = function () {
                ngModel.$setViewValue(elm.val());
                if (!scope.$$phase) {
                  scope.$apply();
                }
              };
            // generate an ID if not present
            if (!attrs.id) {
              attrs.$set('id', 'uiTinymce' + generatedIds++);
            }

            if (attrs.uiTinymce) {
              expression = scope.$eval(attrs.uiTinymce);
            } else {
              expression = {};
            }
            options = {
              // Update model when calling setContent (such as from the source editor popup)
              setup: function (ed) {
                var args;
                ed.on('init', function(args) {
                  ngModel.$render();
                });
                // Update model on button click
                ed.on('ExecCommand', function (e) {
                  ed.save();
                  updateView();
                });
                // Update model on keypress
                ed.on('KeyUp', function (e) {
                  ed.save();
                  updateView();
                });
                // Update model on change, i.e. copy/pasted text, plugins altering content
                ed.on('SetContent', function (e) {
                  ed.save();
                  updateView();
                });
                if (expression.setup) {
                  scope.$eval(expression.setup);
                  delete expression.setup;
                }
              },
              mode: 'exact',
              elements: attrs.id
            };
            // extend options with initial uiTinymceConfig and options from directive attribute value
            angular.extend(options, uiTinymceConfig, expression);
            setTimeout(function () {
              tinymce.init(options);
            });


            ngModel.$render = function() {
              if (!tinyInstance) {
                tinyInstance = tinymce.get(attrs.id);
              }
              if (tinyInstance) {
                tinyInstance.setContent(ngModel.$viewValue || '');
              }
            };
        });
      }
    };
  }]);
