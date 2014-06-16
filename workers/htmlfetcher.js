var fs = require('fs');
var http = require('http-request');
var path = require('path');
var archive = require('../helpers/archive-helpers');

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
  archive.readListOfUrls(function(err, sitesObj){
    for (var site in sitesObj) {
      fetchSingleSite(site);
    }
  });
};