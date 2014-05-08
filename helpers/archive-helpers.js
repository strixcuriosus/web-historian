var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.loadingPage = function(res) {
  var loadingPath = exports.paths.siteAssets + '/loading.html';
  res.writeHead(302, httpHelpers.headers);
  fs.readFile(loadingPath, function(err, data){
    res.end(data.toString());
  });
};

exports.readListOfUrls = function(callback){
  console.log("readlistofurls");
  var result = {};
  var inputPath = exports.paths.list;
  console.log(inputPath);
  fs.readFile(inputPath, function(err, data){
    if (err) {
      console.log(err);
    }
    // console.log("reading the file");
    // console.log(data.toString());
    data = data.toString();
    var index = data.indexOf('\n');
    while (data.length > 0 && index > -1) {
      result[data.substr(0, index)] = true;
      data = data.slice(index + 1);
      index = data.indexOf('\n');
    }
    // console.log("result!!!!",result);
    callback(err, result);
    return result;
  });
};

exports.isUrlInList = function(inputURL, callback){
  // console.log("isurlinlist");
  var ans;
  exports.readListOfUrls(function(err, result){
    // console.log(result);
    // console.log(inputURL);
    // console.log(result.hasOwnProperty(inputURL));
    // console.log(result["www.google.com"]);
    // console.log(!!result[inputURL]);
    ans = !!result[inputURL];
    callback(ans);
    return !!result[inputURL];
  });
  // console.log(ans, "ans");
  return ans;
  // console.log(exports.readListOfUrls());
  // if(urls.hasOwnProperty(inputURL)){
  //   return true;
  // }
  // return false;
};

exports.addUrlToList = function(data){
  var path = exports.paths.list;
  data += "\n";
  fs.appendFile(path, data, function(err){
        console.log(err);
  });
};

exports.isURLArchived = function(inputURL, callback){
  var filePath = exports.paths.archivedSites + "/" + inputURL;
  console.log(filePath);
  fs.readFile(filePath, function(err, data){
    // console.log(data.toString());
    if (err) {
      console.log(err);
      // throw(err);
      data = false;
    }
    // data = data.toString();
    callback(data);
      // return data.toString();

    // return data.toString() || "nodata";
  });

};

exports.downloadUrls = function(){
};
