var http = require("http");
var handler = require("./request-handler");
var CronJob = require('cron').CronJob;
var fetcher = require('../workers/htmlfetcher');

var port = 8000;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);

new CronJob('1 * * * * *', fetcher.fetch, null, true, "America/Los_Angeles");


server.listen(port, ip);


/*

NOTE TO DO / FEATURES TO ADD:
  1)



*/
