
/**
 * Module dependencies.
 */


var express = require('express')
  , app = express()  
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);


var port = process.env.PORT || 5000;
server.listen(port);

//global variable to store input parameter
var connections = {};
var globalID = '';

function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes


app.get('/', function(req, res) {
    params = req.params.id;
    res.sendfile(__dirname +'/views/index.html');
  });



app.get('/:unique', function(req, res) {
    params = req.params.unique;
	res.sendfile(__dirname +'/views/post.html');
    });

function getAndSendID(socket) {
    var uniqueID = randomString(8);
    if(typeof connections[uniqueID] ===  'undefined') {
        globalID = uniqueID;
        //storing it in connections array
        connections[uniqueID] = uniqueID;

        socket.emit('youAreIn', {id:uniqueID})
        return uniqueID;
    } else {
        getAndSendID();
    }
}

io.sockets.on('connection', function(socket) {
     
     socket.on('Test', function() {
      console.log("TEST");
     });

     socket.emit('status',{data:"Connected"});



     socket.on("getMeIn", function(data){
      globalID = getAndSendID(socket);
     
    io.of("/"+globalID).on('connection', function (socket) {
         console.log(connections);

        socket.on('stream', function(data) {
            console.log("Stream Data Recived");
            socket.volatile.broadcast.emit('op_stream', data);
        });

        socket.on('release', function(data) {
          console.log(connections)
          delete  connections[data.id];
          socket.volatile.broadcast.emit('no_connection', data);
          socket.emit('disconnect_client');
          console.log(connections)


        });
    });

  });

});

// io.sockets.on('connection', function(socket) {
//     //storing the room in the socket
//     socket.room = params;
//     console.log("Params: "+params);
    

//     socket.join(params);

//     socket.on('transmitter', function(data) {
//         console.log("transmitter connectted.");
//         socket.leave(params);
//         socket.join('share');

//     });


//     socket.on('stream', function(data) {
//         console.log("Stream Data Recived");
//          io.sockets.in('share').emit('op_stream',data);
//            socket.volatile.broadcast.emit('op_stream', data);
//     });

//     socket.on('disconnect', function() {
//         console.log("disconnect called");
//         socket.leave(socket.room);
//     });
// });