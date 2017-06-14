const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('profile');
});

router.post('/', (req, res) => {
    const username = req.body.username;
    // Save the username to cookie
    res.cookie('username', username);
    res.redirect('/');
});

module.exports = router;