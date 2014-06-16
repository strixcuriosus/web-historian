var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers');


exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

exports.loadingPage = function(res) {
  var loadingPath = exports.paths.siteAssets + '/loading.html';
  res.writeHead(302, httpHelpers.headers);
  fs.readFile(loadingPath, function(err, data){
    res.end(data.toString());
  });
};

exports.readListOfUrls = function(callback){
  var result = {};
  var inputPath = exports.paths.list;
  fs.readFile(inputPath, function(err, data){
    if (err) {
      console.log(err);
    }

    data = data.toString();
    var index = data.indexOf('\n');
    while (data.length > 0 && index > -1) {
      result[data.substr(0, index)] = true;
      data = data.slice(index + 1);
      index = data.indexOf('\n');
    }
    callback(err, result);
    return result;
  });
};

exports.isUrlInList = function(inputURL, callback){
  var ans;
  exports.readListOfUrls(function(err, result){
    ans = !!result[inputURL];
    callback(ans);
    return !!result[inputURL];
  });
  return ans;
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
  fs.readFile(filePath, function(err, data){
    if (err) {
      console.log(err);
      data = false;
    }
    callback(data);
  });

};

exports.downloadUrls = function(){
};
