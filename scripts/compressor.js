/**
 * RUN WITH NODE.JS
 * 
 * Compressor to read in the index.html page and compile all scripts into a single JavaScript
 * file. CSS/LESS files are also minified and combined into a single file.
 */

var fs = require('fs');

var app_dir = __dirname + "/../app/";
var input = app_dir + "index.html";
var output_file = app_dir + "index-production.html";
var minified_css = app_dir + "css/app.min.css";
var minified_js = app_dir + "js/app.min.js";
var jquery = app_dir + "js/jquery-1.9.0.min.js";
var jsdom = require("jsdom");
var less = require("less");
var yui = require("yuicompressor");
var closure = require('closurecompiler');
var exec = require('child_process').exec;
var versionstamp = (new Date()).getTime();

/**
 * Tells us whether or not our url is local
 * @param string
 * @returns boolean
 */
function isRemote(str)
{
    return str.indexOf('//') <= 'https://'.length && str.indexOf('//') !== -1;
}

/**
 * finds, combines, compresses, and replaces all LESS and CSS files into a single file
 */
function compressCSS(window, callback) {
    var $ = window.$;
    var styles = $("link[rel='stylesheet/less'], link[rel='stylesheet']");
    var newTag = null;
    var total_css = "";
    
    // Compresses the topmost element on the elements array
    // if the array is 1 or less, after the compression it calls the callback function
    var processTop = function( elements ) {
        if(elements.length === 0) {
            return;
        }
        
        var el = elements.get(0);
        var source = $(el).attr('href');
        var elements = elements.slice(1, elements.length);
        
        // ignore non-local sources
        if(isRemote(source)) {
            processTop(elements);
            return;
        }
        
        // create a link tag to the new CSS
        if(newTag === null) {
            newTag = $(el).before("<link rel='stylesheet' href='css/app.min.css?"+ versionstamp + "'></link>");
        }
        $(el).remove();

        fs.readFile(app_dir + source, function(error, data) {
            less.render(data.toString(), function(e, css) {
                total_css += css;
                if(elements.length === 0) {
                    yui.compress(total_css, {type: "css"}, function(err, data) {
                        fs.writeFile(minified_css, data);
                        callback();
                    });
                }
                else
                {
                    // go another round
                    processTop(elements);
                }
            });
        });
    };
    processTop(styles);
};

/**
 * All script tags that can be converted to use a CDN are converted.
 */
function cdnScripts(window)
{
    var $ = window.$;
    window.$('script[data-cdn]').each(function(){
        $(this).attr('src',$(this).attr('data-cdn')).removeAttr('data-cdn');
    });
}

/**
 * Combines all local JavaScript files, excluding those with the data-exclude-compress
 * attribute, and compiles them with the Google Closure Compiler
 * @param Object window
 * @param function callback
 * @returns void
 */
function compressJS(window, callback) {
    var $ = window.$;
    var toCompress = []; // an array of scripts to concatenate and compress

    var $script_tags = $("script:not([data-exclude-compress])").filter(function() {
        if(!isRemote($(this).attr('src'))) {
            toCompress.push(app_dir + $(this).attr('src'));
            return true;
        }
        else
        {
            return false;
        }
    });
    $script_tags.first().before("<script src='js/app.min.js?"+ versionstamp +"'></script>");
    $script_tags.remove();
    closure.compile(toCompress,{}, function(err, output) {
        fs.writeFile(minified_js, output);
        callback();
    });
};

/**
 * Removes all developmental scripts that have the data-remove attribute
 */
function removeUnwantedScripts(window)
{
    window.$("script[data-remove]").remove();
};

// Start the process
jsdom.env(input, [jquery], function(errors, window) {
    var $ = window.$;
    removeUnwantedScripts(window);
    cdnScripts(window);
    $('.jsdom').remove();
    
    compressCSS(window, function() {
        compressJS(window, function() {
            var output = fs.openSync(output_file,"w");
            fs.write(output,window.document.innerHTML);
            fs.close(output);
        });
    });
});
