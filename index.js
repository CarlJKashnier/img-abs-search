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
//Check if valid request
//Check if vaild pathname
if(parsedURL.path.substring(0, 9) == '\/api\/img\/') {
  var searchTerm = sanitize(parsedURL.pathname.substring(9).replace(/%20/g, ' '));
  if(parsedURL.query == null){
    offset = 0;
    bingSearch(searchTerm, offset)
    return
  } else {
    //check if offset is good if not then return 0 for query
  if(parsedURL.query.substring(0,7) === "offset=" && !isNaN(parsedURL.path.substring(parsedURL.pathname.length + 8))) {
  var offset = parsedURL.path.substring(parsedURL.pathname.length + 8);
  console.log(searchTerm +' '+offset + " Second")
      bingSearch(searchTerm, offset)
  //Add Call to Search function
} else {
  if(parsedURL.path.length == parsedURL.pathname.length){
    var offset = 0;
    console.log(searchTerm +' '+offset + " Third")
    // Add call to Search function
    bingSearch()
  } else {
    //send error
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({"error": "Malformed offset"}));
  res.end();
  return;
}}}}

return
//Function is in server so can use the REQ variable
function bingSearch(searchTerm, offsetSearch){
  bing.images(searchTerm, function(err, resp, body){
  var toClientOut = []
  for(var i=0; i<10;i++){
    var toPushObj = {"url": body.d.results[0].MediaUrl, "snippet": body.d.results[0].Title, "thumbnail": body.d.results[0].Thumbnail.MediaUrl, "context": body.d.results[0].SourceUrl}
    toClientOut.push(toPushObj)
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(toClientOut));
  res.end();
  return
  })
}

});
server.listen(process.env.PORT || 8888);
