const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


var http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/socket.html');
});
let button = '';
io.on('connection', function(socket){
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    socket.on('start stream', function (msg) {
        button = 'disabled';
        let obj = {};
        obj.msg = msg;
        obj.button = button;
        console.log(obj)
        socket.broadcast.emit('start stream', obj)
    });
    socket.on('check button', function () {
        if (button == 'disabled') {
            socket.emit('check button', 'disabled')
        }else {
            socket.emit('check button', 'not disabled')
        }
    });
    socket.on('disconnect', function () { });

    // socket.on('chat message', function(msg){
    //     console.log(msg);
    //     io.emit( 'chat message' , msg);
    // });
    //
    // socket.on('stream', function (stream) {
    //     io.emit('stream', stream)
    // });
    // socket.on('stop stream', function () {
    //     io.emit('stream', 'stop')
    // });
    socket.on('disconnect', function(){
        console.log('user disconnected from your channel');
    });
});
http.listen(3000, function(){
    console.log('listening on *:3000');
});


const tasksRotues = require('./routes/tasks');


const galleryRoutes = require('./routes/gallery');


app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/tasks', tasksRotues);
app.use(express.static(path.join(__dirname, '/')));
app.use('/gallery', galleryRoutes);

// Error handling
app.use((err, req, res, next) => {
    const {message} = err;
    res.json({status: 'ERROR', message});
});

app.listen(8080);
