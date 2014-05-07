var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    var urlPath = url.parse(req.url).path;
    if (urlPath === '/') {
      urlPath += 'index.html';
    }
    var indexPath = archive.paths.siteAssets + urlPath;
    console.log(indexPath);
    fs.readFile(indexPath, function(err, data){
      if (err) {
        res.writeHead(404, httpHelpers.headers);
        res.end();
        // return;
      } else {
        res.writeHead(200, httpHelpers.headers);
        console.log(data.toString());
        res.end(data.toString());

      }
      // return;
    });
  } else if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      var loadingPath = archive.paths.siteAssets + '/loading.html';
      data = data.substring(4) + '\n';
      fs.appendFile(archive.paths.list, data, function(err){
        console.log(err);
      });
      res.writeHead(302, httpHelpers.headers);
      fs.readFile(loadingPath, function(err, data){
        res.end(data.toString());
      });
    });
  } else {
    res.writeHead(404, httpHelpers.headers)
    res.end(archive.paths.list);
  }

};
