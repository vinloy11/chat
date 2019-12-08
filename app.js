const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const fs = require('fs')

var http = require('http').createServer(app);
const io = require('socket.io')(http);
app.get('/chat', function (req, res) {
    res.sendFile(__dirname + '/socket.html');
});
let button = '';
let onlineUsers = 0;
let mainUser = 0;
io.on('connection', function (socket) {
    onlineUsers++;
    // console.log(onlineUsers)
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    socket.on('close window', stopStream);
    socket.on('start stream', startStream);
    socket.on('stop stream', stopStream);
    socket.on('disconnect', disconnect);
    socket.on('check state', checkState);
    socket.on('chat message', chat);

    function checkState() {
        if (button === 'disabled') {
            socket.emit('check state', 'disabled')
        } else {
            socket.emit('check state', 'not disabled')
        }
    }

    function startStream(video) {
        button = 'disabled';
        if (video !== 'data:,') {
            socket.broadcast.emit('start stream', video)
        } else {
            return true;
        }
    }

    function closeWindow(user) {
        if (user === 1) {
          socket.emit('stop stream')
        }
    }

    function stopStream() {
        button = '';
        socket.broadcast.emit('stop stream')
    }

    function disconnect() {
        onlineUsers--;
        console.log(onlineUsers);
        console.log('user disconnected from your channel');
    }

    function chat(msg) {
        console.log(msg);
        io.emit( 'chat message' , msg);
    }
});

http.listen(3001, function () {
    console.log('listening on *:3001');
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
var img = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0"
    + "NAAAAKElEQVQ4jWNgYGD4Twzu6FhFFGYYNXDUwGFpIAk2E4dHDRw1cDgaCAASFOffhEIO"
    + "3gAAAABJRU5ErkJggg==";
var data = img.replace(/^data:image\/\w+;base64,/, "");
fs.writeFile('imag2e.png', data,{encoding:'base64'} , () => {});
//https://stackoverflow.com/questions/43487543/writing-binary-data-using-node-js-fs-writefile-to-create-an-image-file


app.listen(8080);
