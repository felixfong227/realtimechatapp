/*
describe:
Handling profile things
*/
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.render('profile', {
        username: req.cookies.username || '',
        notification: req.cookies.notification || true,
        soundeffect: req.cookies.soundeffect || true,
        isNew: req.query.status === 'new' ? 'Please choose your username' : null,
        message: req.session.message || null,
    });
});

router.post('/', (req, res) => {
    let username = req.body.username.trim();
    if (username.length <= 0) {
        // req.session.profile.message = 'Invalid username: Username is too short';
        req.session.message = 'Invalid username: Username is too short';
        console.log(req.session);
        res.redirect('/profile');
    }
    const notification = typeof req.body.notification !== 'undefined' ? 'true' : 'false';
    const soundeffect = typeof req.body.soundeffect !== 'undefined' ? 'true' : 'false';
    if (username) {
        username = username.replace(/ /igm, '');
        // Save the username to cookie
        res.cookie('username', username);
        res.cookie('notification', notification);
        res.cookie('soundeffect', soundeffect);
        res.redirect('/');
    }
});

module.exports = router;
