//dotenv will load the .env file for the local environment
//This keeps my API and Mongo_URI String out of view for streaming
var dotenv = require('dotenv').config();
var http = require('http')
var url = require('url')
var mongo = require('mongodb')
var sanitize = require('sanitize-caja')
var bing = require('node-bing-api')({accKey: process.env.BING_API})

//https://frozen-ravine-19624.herokuapp.com/

var server = http.createServer(function (req, res) {

var parsedURL = url.parse(req.url)
  //trap favicon.ico traffic
if(parsedURL.path == '/favicon.ico'){return};
  //done trapping favicon.ico
if(parsedURL.path.substring(0, 9) == '\/api\/img\/') {
  console.log('true');
  var searchTerm = parsedURL.pathname.substring(9);
  if(parsedURL.query == null){
    offset = 0;
  } else {
  if(parsedURL.query.substring(0,7) === "offset=" && !isNaN(parsedURL.path.substring(parsedURL.pathname.length + 8))) {
  var offset = parsedURL.path.substring(parsedURL.pathname.length + 8);
  console.log("Is Int");
} else {
  if(parsedURL.path.length == parsedURL.pathname.length){
    offset = 0;
  } else {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({"error": "Malformed offset"}));
  res.end();
  return;
}}}} else {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({"error": "Malformed search query"}));
  res.end();
  return
}
searchTerm = searchTerm.replace(/%20/g, ' ');
bing.images(searchTerm, function(err, resp, body){
var toClientOut = []
for(var i=0; i<10;i++){
  var toPushObj = {"url": body.d.results[0].MediaUrl, "snippet": body.d.results[0].Title, "thumbnail": body.d.results[0].Thumbnail.MediaUrl, "context": body.d.results[0].SourceUrl}
  toClientOut.push(toPushObj)
}
res.writeHead(200, { 'Content-Type': 'application/json' });
res.write(JSON.stringify(toClientOut));
res.end();
})



console.log(searchTerm + " " + offset);


});
server.listen(process.env.PORT || 8888);
