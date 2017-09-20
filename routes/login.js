var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('authenticate/login');
});

router.post('/', passport.authenticate('local-login', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;
