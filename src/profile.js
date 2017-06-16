/*
describe:
Handling profile things
*/
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('profile', {
        username: req.cookies.username || '',
    });
});

router.post('/', (req, res) => {
    let username = req.body.username;
    if(username){
        username = username.replace(/ /igm, '');
        // Save the username to cookie
        res.cookie('username', username);
        res.redirect('/');
    }
});

module.exports = router;