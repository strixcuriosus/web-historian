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
      data = data.substring(4);
      archive.isUrlInList(data, function(URLinList){
        if (URLinList){
          console.log("hi!!!!!");
          archive.isURLArchived(data, function (data) {
            console.log("data",data);
            if(data) {
              res.writeHead(200, httpHelpers.headers);
              res.end(data);
              // console.log("your url is archived, yay!", data);
            } else {
              archive.loadingPage(res);
              // res.writeHead(404, httpHelpers.headers);
              // res.end();
              console.log("URLinArchive is false");
            }
          });
        } else {
          archive.loadingPage(res);
        }
      });
    });


      //   console.log('hi');
      //   if (archive.isURLArchived(data)) {
      //     fs.readFile()// read archived file from the input path
      //   } else {
      //     archive.loadingPage(res);
      //   }
      // } else {
      //   console.log('else')
      //   archive.loadingPage(res);
      // }


  } else {
    res.writeHead(404, httpHelpers.headers);
    res.end(archive.paths.list);
  }

};
