var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('authenticate/register');
});

router.post('/', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/register',
    failureFlash: true
}));

module.exports = router;
