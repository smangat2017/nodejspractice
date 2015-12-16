var http = require('http');
var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/callback-newsfeed-db');

var server = http.createServer(app);

require('./settings.js')(app, express);
require('./routes/index.js')(app);

server.listen(process.env.PORT || 3000);
console.log('Listening at 127.0.0.1:' + 3000);
