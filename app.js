const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
let button = '';
let onlineUsers = 0;
const mainUser = 0;
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'accept, content-type, Content-Type, enctype');
    next();
});
io.on('connection', (socket) => {
    onlineUsers++;
    console.log('a user connected');
    socket.broadcast.emit('user connected');
    socket.on('close window', stopStream);
    socket.on('start stream', startStream);
    socket.on('stop stream', stopStream);
    socket.on('disconnect', disconnect);
    socket.on('check state', checkState);
    socket.on('chat message', chat);
    socket.on('change number', changeAccountNumber);

    function checkState() {
        if (button === 'disabled') {
            socket.emit('check state', 'disabled');
        } else {
            socket.emit('check state', 'not disabled');
        }
    }

    function startStream(video) {
        button = 'disabled';
        if (video !== 'data:,') {
            socket.broadcast.emit('start stream', video);
        } else {
            return true;
        }
    }

    function changeAccountNumber(number) {
        socket.broadcast.emit('change number', number);
    }

    function stopStream() {
        button = '';
        socket.broadcast.emit('stop stream');
    }

    function disconnect() {
        onlineUsers--;
    }

    function chat(msg) {
        io.emit('chat message', msg);
    }
});

http.listen(3001, () => {
});


const tasksRotues = require('./routes/tasks');


const galleryRoutes = require('./routes/gallery');


app.use(bodyParser.json()); // application/json

app.use('/tasks', tasksRotues);
app.use(express.static(path.join(__dirname, '/')));
app.use('/gallery', galleryRoutes);

// Error handling
app.use((err, req, res, next) => {
    const {message} = err;
    res.json({status: 'ERROR', message});
});


app.listen(8080);
