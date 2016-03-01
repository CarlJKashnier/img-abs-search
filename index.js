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
  bingSearch(searchTerm, offset)
  return
  //Add Call to Search function
}  else {
    //send error
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({"error": "Malformed offset"}));
  res.end();
  return;
}}};


if(parsedURL.path.substring(0, 7) == '\/recent') {

  mongo.connect(process.env.MONGOLAB_URI,function(err,db){

   db.collection('searchhx').count(function(e, count){
  db.collection('searchhx').find({localID: {$gt: count-10}},{searchterm: 1, when: 1, _id: 0}).toArray(function(err, stuff){
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(stuff));
  res.end();
})
})
})
}





//Function is in server so can use the res variable, good times.
function bingSearch(searchTerm, offsetSearch){
  bing.images(searchTerm, {skip:offsetSearch}, function(err, resp, body){
  var toClientOut = []
  for(var i=0; i<10;i++){
    var toPushObj = {"url": body.d.results[0].MediaUrl, "snippet": body.d.results[0].Title, "thumbnail": body.d.results[0].Thumbnail.MediaUrl, "context": body.d.results[0].SourceUrl}
    toClientOut.push(toPushObj)
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(toClientOut));
  res.end();

  mongo.connect(process.env.MONGOLAB_URI,function(err,db){
//get number of records & add to DB
    var currentRecord = db.collection('searchhx').count(function(e, count){
      var host = req.headers['x-forwarded-for'] ||
       req.connection.remoteAddress ||
       req.socket.remoteAddress ||
       req.connection.socket.remoteAddress;
       db.collection('searchhx').insert({ip: host, searchterm: searchTerm, when: Date(), localID: count + 1})
    })

      db.close
});

    });
  return
};


});
server.listen(process.env.PORT || 8888);
