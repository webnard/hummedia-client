var fs = require('fs');

var app_dir = __dirname + "/../app/";
var input = app_dir + "index.html";
var output_file = app_dir + "index-production.html";
var minified_css = app_dir + "css/app.min.css";
var jquery = app_dir + "js/jquery-1.9.0.min.js";
var jsdom = require("jsdom");
var exec = require('child_process').exec;

function compressCSS(window) {
    fs.unlink(minified_css + ".tmp");
    var $ = window.$;
    var styles = $("link[rel='stylesheet/less'],link[rel='stylesheet']");
    var toProcess = styles.length-1;
    var newTag = null;
    
    styles.each(function() {
            var source = $(this).attr('href');
            // ignore non-local sources
            if(source.indexOf('//') <= 'https://'.length && source.indexOf('//') !== -1) {
                return;
            }
            
            // create a link tag to the new CSS
            if(newTag === null) {
                newTag = $(this).before("<link rel='stylesheet/less' href='css/app.min.css'></link>");
            }
            
            $(this).remove();
            
            exec("lessc " + app_dir + source + " >> " + minified_css + ".tmp", function(){
                toProcess--;
                // all CSS/LESS files processed, so now compress
                if(toProcess === 0) {
                    exec("yui-compressor --type=css " + minified_css + ".tmp > " + minified_css, function(a,b,c) {
                        fs.unlink(minified_css + ".tmp");
                    });
                }
            });
    });
};

jsdom.env(input, [jquery], function(errors, window) {
    var $ = window.$;
    var output = fs.openSync(output_file,"w");
    compressCSS(window);
    $('.jsdom').remove();
    fs.write(output,window.document.innerHTML);
    fs.close(output);
});
