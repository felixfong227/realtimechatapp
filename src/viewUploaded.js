/*
describe:
Someone try to view the uploaded assets
*/
const express = require('express');

const router = express.Router();

router.get('/:file?', (req, res) => {
    const file = req.params.file;
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(`${__dirname}/../uploads/${file}`);
    // Look for the file
    fs.exists(filePath, (exists) => {
        if (exists) {
            res.sendFile(filePath);
        } else {
            res.status(404);
            res.end(JSON.stringify({
                error: true,
                msg: 'Can not find that file',
            }));
        }
    });
});

module.exports = router;
