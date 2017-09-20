var express = require('express');
var messages = require('express-messages');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var path = require('path');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var configDB = require('./config/database');
mongoose.connect(configDB.url);
var app = express();


var port = process.env.PORT || 3030;

var index = require('./routes/index');
var login = require('./routes/login');
var register = require('./routes/register');
var dashboard = require('./routes/dashboard');

/* Set up view engine */
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

/* Set up the middleware */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'learningsucksbigtime',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(flash());
app.use(morgan('dev'));

/* Set up passport for auth */
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

/* Set up static path */
app.use(express.static(path.join(__dirname, 'public')));


/* Use the routes */
app.use('/', index);
app.use('/login', login);
app.use('/register', register);
app.use('/dashboard', dashboard);

app.get('*', function(req, res){
  res.render('404');
});

app.listen(port, function() {
    console.log('Server running on port '+ port);
});
