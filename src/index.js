const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io').listen(server);
app.io = io;
const path = require('path');
const randomstring = require('randomstring');
const sha256 = require('sha256');

const port = process.env.PORT || 3000;

const users = {};

server.listen(port, () => {
    console.log(`Serer is running on port ${port}`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(`${__dirname}/../public`));
app.use('/static', express.static(path.join(`${__dirname}/../public`)));


app.use('/', (req, res) => {
    res.render('index');
    require('./chat')(app.io);
});