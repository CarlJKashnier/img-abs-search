//dotenv will load the .env file for the local environment
//This keeps my API and Mongo_URI String out of view for streaming
 
var dotenv = require('dotenv').config();
var http = require('http')
var url = require('url')
var mongo = require('mongodb')
var sanitize = require('sanatize-caja')

var server = http.createServer(function (req, res) {


});
server.listen(process.env.PORT || 8888);
