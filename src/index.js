const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const sha256 = require('sha256');
const io = require('socket.io').listen(server);

const port = process.env.PORT || 3000;

module.exports.users = {};

server.listen(port, () => {
    console.log(`Serer is running on port ${port}`);
});

app.set('view engine', 'ejs');
app.set('views', path.join(`${__dirname}/../public`));
app.use('/static', express.static(path.join(`${__dirname}/../public`)));

app.get('/', (req, res) => {
    res.render('index');
});

// initial chat web socket api
require('./chat')(io);