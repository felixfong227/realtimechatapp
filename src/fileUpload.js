/*
describe:
Handling the file upload
*/
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const fileUrl = req.protocol + '://' + req.get('host');
    const formidable = require('formidable');
    const form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.parse(req);
    /*
    describe:
    Get the file info, like file name or file size
    */
    form.on('fileBegin', (name, file) => {
        if(file.type.includes('image') && !file.type.includes('photoshop')){
            const path = require('path');
            const sha256 = require('sha256');
            const randomstring = require('randomstring');
            const fileExtension = path.extname(file.name);
            const newFileID = sha256( randomstring.generate(50) );
            const filePath = newFileID + fileExtension;
            /*
            describe:
            Save the file to the server
            */
            file.path = path.join(`${__dirname}/../uploads/${filePath}`);
            res.setHeader('Content-Type', 'application/json');
            /*
            describe:
            Return a JSON object that contain the file location
            */
            res.end(JSON.stringify({
                status: 200,
                image: {
                    url: `${fileUrl}/view/uploaded/content/${filePath}`,
                },
            }, null, 2));
        }else{
            res.end(JSON.stringify({
                error: true,
                msg: 'For now we only support image file',
            }, null, 2));
        }
    });
});

module.exports = router;