// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var fs = require('fs');
var http = require('http-request');
var path = require('path');
var archive = require('../helpers/archive-helpers');

//read list of urls -- expect an object of sites (passed to callback)
//iterate over all sites in object
  //pass each key to isArchived
    //if not archived
      //jsonp grab site
      //write to archives


var fetchSingleSite = function(site) {
  archive.isURLArchived(site, function(data) {
  console.log('archivedcallback');
    if (! data) {
      var siteToFetch = 'http://' + site;
      http.get(siteToFetch, function(err, response) {
        response = response.buffer.toString();
        var archivePath = archive.paths.archivedSites + '/' + siteToFetch.slice(7);
        fs.writeFile(archivePath, response, function (err) {
          if (err) { throw err; }
        });
      });
    }
  });
};

exports.fetch = function () {
  console.log("fetching!");
  archive.readListOfUrls(function(err, sitesObj){
    // console.log("readlist callback!");
    // console.log(sitesObj);
    for (var site in sitesObj) {
      // console.log(site);
      fetchSingleSite(site);
    }
  });
};

// exports.fetch();
