var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
var PORT = process.env.PORT || 3000;
server.listen(PORT);
console.log('Server running ...');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Connected :%s sockets connected', connections.length);

    //desco
    socket.on('disconnect', function (data) {
      
        users.splice(users.indexOf(socket.username), 1);
        io.sockets.emit('get users', users);

        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected:%s sockets connected', connections.length);
    });
    //send Message
    socket.on('send message', function (data) {

        io.sockets.emit('new message', { msg: data, user: socket.username });
    });
    //new user
    socket.on('new user', function (data, callback) {
        callback(true);
        
        socket.username = data;
        users.push(socket.username);
        io.sockets.emit('get users', users);

    });
    
});