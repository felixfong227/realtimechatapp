/*
describe:
Main entry to the backend
*/
const express = require('express');
const app = express();
const http = require('http');

const server = http.createServer(app);
const path = require('path');
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(`${__dirname}/../public`));
app.use('/static', express.static(path.join(`${__dirname}/../public`)));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

server.listen(port, () => {
    console.log(`Serer is running on port ${port}`);
});

app.use(bodyParser.json());


// initial chat web socket api
require('./chat')(io);

app.use('/api/file/upload', require('./fileUpload'));

// View user uploaded content
app.use('/view/uploaded/content', require('./viewUploaded'));

// Update profile
app.use('/profile', require('./profile'));

app.get('/', (req, res) => {
    res.render('index');
});
