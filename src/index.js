const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const path = require('path');
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const cors = require('cors');
const subdomain = require('express-subdomain');

const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(`${__dirname}/../public`));
app.use('/static', express.static(path.join(`${__dirname}/../public`)));
app.use(cors());
app.use(bodyParser.json());

module.exports.users = {};


server.listen(port, () => {
    console.log(`Serer is running on port ${port}`);
});

app.use(bodyParser.json());


// initial chat web socket api
require('./chat')(io);

app.use('/api/file/upload', require('./fileUpload'));

// View user uploaded content
app.use('/view/uploaded/content', require('./viewUploaded'));

app.get('/', (req, res) => {
    res.render('index');
});