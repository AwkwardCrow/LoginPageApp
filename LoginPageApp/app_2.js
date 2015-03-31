//
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var functions = require('./server/modules/functions.js');
var mongo = require('mongodb').MongoClient;
var MongoStore = require('connect-mongo')(express); //session store
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/public')));
//sessions w/session store
app.use(express.bodyParser());
app.use(express.cookieParser());
//initialize session middleware with connect-mongo
app.use(express.session({ secret: '1234567890QWERTY' }));
app.use(app.router); //also used for cookies/sessions

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


require('./server/router')(app);

var serve = http.createServer(app);
var io = require('socket.io')(serve);



serve.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

io.on('connection', function (socket) {
    console.log('a user connected');
    
    mongo.connect("mongodb://MongoLab-2:0dgnte5abaFc1PrgUDz8VWw2fCR5Na6GaFXHIPqhKrg-@ds062097.mongolab.com:62097/MongoLab-2", function (err, db) {
        var collection = db.collection('chat messages')
        var stream = collection.find().sort({ date : -1 }).limit(4).stream();
        stream.on('data', function (chat) { socket.emit('chat', chat.date+": "+chat.content); });
    });
   
  
    socket.on('disconnect', function () {       
        console.log('user disconnected');
    });
    
    socket.on('chat', function (msg) {
        console.log("message sent");
        mongo.connect("mongodb://MongoLab-2:0dgnte5abaFc1PrgUDz8VWw2fCR5Na6GaFXHIPqhKrg-@ds062097.mongolab.com:62097/MongoLab-2", function (err, db) {
            var collection = db.collection('chat messages');
            collection.insert({ content: msg , date: functions.datetime()}, function (err, o) {
                if (err) { console.warn(err.message); }
                else { console.log("chat message inserted into db: " + msg+" "+functions.datetime()); }
            });
        });
        
        socket.broadcast.emit('chat', msg);
    });
});
          