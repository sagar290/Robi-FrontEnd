var express = require('express');
var moment = require('moment');
var router = express.Router();

router.get('/', function(req, res) {
    res.redirect('/dashboard');
});

module.exports = router;
