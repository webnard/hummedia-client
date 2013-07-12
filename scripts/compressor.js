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
var jquery = app_dir + "lib/jquery-2.0.0.js";
var jsdom = require("jsdom");
var less = require("less");
var closure = require('closurecompiler');
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
    var new_css_link_added = false;
    var total_css = "";
    
    $("link[rel='stylesheet/less'], link[rel='stylesheet']").not("[data-exclude-compress]").each(function(){
        if(isRemote($(this).attr('href'))) {
            return;
        }
        
        if(!new_css_link_added) {
            new_css_link_added = true;
            $(this).before("<link rel='stylesheet' href='css/app.min.css?"+ versionstamp + "'></link>");
        }
        
        total_css += fs.readFileSync(app_dir + $(this).attr('href'));
        $(this).remove();
    });
    
    less.render(total_css, {yuicompress: true}, function(e, css) {
            fs.writeFile(minified_css, css);
            callback();
    });
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
        if(!$(this).attr('src')) {
            return;
        }
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
        if(err) {
            console.log(err);
        }
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
            fs.write(output,window.document.doctype + window.document.innerHTML);
            fs.close(output);
        });
    });
});
