
/**
	* Node.js Login Boilerplate
	* More Info : http://bit.ly/LsODY8
	* Copyright (c) 2013 Stephen Braitsch
**/

var express = require('express');
var http = require('http');
var functions = require('./server/modules/functions.js');
var mongo = require('mongodb').MongoClient;
var app = express();

app.configure(function(){
	app.set('port', 1337);
	app.set('views', __dirname + '/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
//	app.use(express.favicon());
//	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/public' }));
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

require('./server/router')(app);

var serve = http.createServer(app);
var io = require('socket.io')(serve);



//http.createServer(app).listen(app.get('port'), function(){
//	console.log("Express server listening on port " + app.get('port'));
//})

serve.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function (socket) {
    console.log('a user connected');
    
    mongo.connect("mongodb://MongoLab-2:0dgnte5abaFc1PrgUDz8VWw2fCR5Na6GaFXHIPqhKrg-@ds062097.mongolab.com:62097/MongoLab-2", function (err, db) {
        var collection = db.collection('chat messages')
        var stream = collection.find().sort({ date : -1 }).limit(4).stream();
        stream.on('data', function (chat) { socket.emit('chat', chat.date + ": " + chat.content); });
    });
    
    
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    
    socket.on('chat', function (msg) {
        console.log("message sent");
        mongo.connect("mongodb://MongoLab-2:0dgnte5abaFc1PrgUDz8VWw2fCR5Na6GaFXHIPqhKrg-@ds062097.mongolab.com:62097/MongoLab-2", function (err, db) {
            var collection = db.collection('chat messages');
            collection.insert({ content: msg , date: functions.datetime() }, function (err, o) {
                if (err) { console.warn(err.message); }
                else { console.log("chat message inserted into db: " + msg + " " + functions.datetime()); }
            });
        });
        
        socket.broadcast.emit('chat', msg);
    });
});