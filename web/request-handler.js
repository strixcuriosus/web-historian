var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var url = require('url');

exports.handleRequest = function (req, res) {
  if (req.method === 'GET') {
    var urlPath = url.parse(req.url).path;
    if (urlPath === '/') {
      urlPath += 'index.html';
      var indexPath = archive.paths.siteAssets + urlPath;
      console.log(indexPath);
      fs.readFile(indexPath, function(err, data){
        if (err) {
          res.writeHead(404, httpHelpers.headers);
          res.end();
        } else {
          res.writeHead(200, httpHelpers.headers);
          console.log(data.toString());
          res.end(data.toString());

        }
      });
    } else {
      archive.isURLArchived(urlPath, function (data) {
            if(data) {
              data = data.toString();
            console.log("data",data);
              res.writeHead(200, httpHelpers.headers);
              res.end(data);
            } else {
              archive.loadingPage(res);
              console.log("URLinArchive is false");
              res.writeHead(404, httpHelpers.headers);
              res.end(archive.paths.list);
            }
          });
    }

  } else if (req.method === 'POST') {
    var data = '';
    req.on('data', function(chunk){
      data += chunk;
    });
    req.on('end', function(){
      data = data.substring(4);
      archive.isUrlInList(data, function(URLinList){
        if (URLinList){
          console.log("hi!!!!!");
          archive.isURLArchived(data, function (data) {
            console.log("data",data);
            if(data) {
              data = data.toString();
              res.writeHead(200, httpHelpers.headers);
              res.end(data);
            } else {
              archive.loadingPage(res);

              console.log("URLinArchive is false");
              res.writeHead(404, httpHelpers.headers);
              res.end(archive.paths.list);
            }
          });
        } else {
          archive.addUrlToList(data);
          archive.loadingPage(res);
        }
      });
    });



  } else {
    res.writeHead(404, httpHelpers.headers);
    res.end(archive.paths.list);
  }

};
