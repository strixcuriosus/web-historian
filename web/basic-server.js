var http = require("http");
var handler = require("./request-handler");
var fetcher = require('../workers/htmlfetcher');

var port = 8000;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);

fetcher.fetch();
server.listen(port, ip);
