var fs = require('fs');

var app_dir = __dirname + "/../app/";
var input = app_dir + "index.html";
var output_file = app_dir + "index-production.html";
var minified_css = app_dir + "css/app.min.css";
var minified_js = app_dir + "js/app.min.js";
var closure_jar = __dirname + '/closure-compiler/compiler.jar';
var jquery = app_dir + "js/jquery-1.9.0.min.js";
var jsdom = require("jsdom");
var exec = require('child_process').exec;
var versionstamp = (new Date()).getTime();

/**
 * Tells us whether or not our url is local
 * @param string
 * @returns boolean
 */
function isLocal(str)
{
    return str.indexOf('//') <= 'https://'.length && str.indexOf('//') !== -1;
}

function compressCSS(window, callback) {
    fs.unlink(minified_css + ".tmp");
    var $ = window.$;
    var styles = $("link[rel='stylesheet/less'], link[rel='stylesheet']");
    var newTag = null;
    
    var processTop = function( elements ) {
        if(elements.length === 0) {
            return;
        }
        
        var el = elements.get(0);
        var source = $(el).attr('href');
        var elements = elements.slice(1, elements.length);
        
        // ignore non-local sources
        if(isLocal(source)) {
            processTop(elements);
            return;
        }
        
        // create a link tag to the new CSS
        if(newTag === null) {
            newTag = $(el).before("<link rel='stylesheet' href='css/app.min.css?"+ versionstamp + "'></link>");
        }
        $(el).remove();

        exec("lessc " + app_dir + source + " >> " + minified_css + ".tmp", function(){
            processTop(elements);
            // all CSS/LESS files processed, so now compress
            if(elements.length === 0) {
                exec("yui-compressor --type=css " + minified_css + ".tmp > " + minified_css, function() {
                    fs.unlink(minified_css + ".tmp");
                    callback();
                });
            }
        });
    };
    processTop(styles);
};

/**
 * All scripts that can be converted to use a CDN are
 */
function cdnScripts(window)
{
    var $ = window.$;
    window.$('script[data-cdn]').each(function(){
        $(this).attr('src',$(this).attr('data-cdn')).removeAttr('data-cdn');
    });
}

function compressJS(window, callback) {
    fs.unlink(minified_js + ".tmp");
    var $ = window.$;
    var scripts = $("script:not([data-exclude-compress])");
    var newTag = null;
    
    
    var processTop = function( elements ) {
        if(elements.length === 0) {
            return;
        }
        
        var el = elements.get(0);
        var source = $(el).attr('src');
        var elements = elements.slice(1, elements.length);
        
        // ignore non-local sources
        if(isLocal(source)) {
            processTop(elements);
            return;
        }
        
        // create a link tag to the new CSS
        if(newTag === null) {
            newTag = $(el).before("<script src='js/app.min.js?"+ versionstamp +"'></script>");
        }
        $(el).remove();

        exec("cat " + app_dir + source + " >> " + minified_js + ".tmp", function(){
            processTop(elements);
            // all CSS/LESS files processed, so now compress
            if(elements.length === 0) {
                exec("java -jar " + closure_jar + " " + minified_js + ".tmp --js_output_file=" + minified_js, function() {
                    //fs.unlink(minified_js + ".tmp");
                    callback();
                });
            }
        });
    };
    processTop(scripts);
};

function removeUnwantedScripts(window)
{
    window.$("script[data-remove]").remove();
};

jsdom.env(input, [jquery], function(errors, window) {
    var $ = window.$;
    var output = fs.openSync(output_file,"w");
    removeUnwantedScripts(window);
    cdnScripts(window);
    $('.jsdom').remove();
    
    compressCSS(window, function() {
        compressJS(window, function() {
            fs.write(output,window.document.innerHTML);
            fs.close(output);
        });
    });
});
