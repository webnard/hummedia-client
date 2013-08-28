/**
 * RUN WITH NODE.JS
 * 
 * Compressor to read in the index.html page and compile all scripts into a single JavaScript
 * file. CSS/LESS files are also minified and combined into a single file.
 */

var fs = require('fs');
    ncp = require('ncp').ncp;

var output_dir = __dirname + "/../production/"
    app_dir = __dirname + "/../app/",
    input = app_dir + "index.html",
    output_file = output_dir + "index-production.html",
    minified_css = output_dir + "css/app.min.css",
    minified_js = output_dir + "js/app.min.js",
    jquery = app_dir + "lib/jquery-2.0.0.js",
    jsdom = require("jsdom"),
    less = require("less"),
    closure = require('closurecompiler'),
    versionstamp = (new Date()).getTime();

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
        var href = $(this).attr('href');

        if(isRemote(href)) {
            return;
        }
        
        if(!new_css_link_added) {
            new_css_link_added = true;
            $(this).before("<link rel='stylesheet' href='css/app.min.css?"+ versionstamp + "'></link>");
        }
        
        total_css += fs.readFileSync(app_dir + href);

        // remove old stylesheet from HTML and from production directory
        fs.unlink(output_dir + href);
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
        fs.unlink(output_dir + $(this).attr('src'));
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
        
        toCompress.forEach(function(src) {
            var oldFile = output_dir + src.substr(app_dir.length);
            fs.unlink(oldFile);
        });
        callback();
    });
};

/**
 * Removes all developmental scripts that have the data-remove attribute
 */
function removeUnwantedScripts(window)
{
    var $ = window.$;
    $("script[data-remove]").each(function(){
        fs.unlink(output_dir + $(this).attr('src'));
        $(this).remove();
    });
};

function deleteFolderRecursive(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

// Start the process
jsdom.env(input, [jquery], function(errors, window) {
    deleteFolderRecursive(output_dir);

    var $ = window.$;
    $('.jsdom').remove();
    
    ncp(app_dir, output_dir, function() {
        removeUnwantedScripts(window);
        cdnScripts(window);

        compressCSS(window, function() {
            compressJS(window, function() {
                var output = fs.openSync(output_file,"w");
                fs.write(output,window.document.doctype + window.document.innerHTML);
                fs.close(output);
                fs.rename(output_file, output_dir + '/index.html');
            });
        });
    });
});
