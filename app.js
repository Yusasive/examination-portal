var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
const helmet = require('helmet');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
var passport = require("./services/passportconf");
var app = express();
const cors = require('cors');

app.use(helmet());
const corsOptions = {
    origin: ['http://localhost:3000', 'https://examination-portal-six.vercel.app', 'https://physical-sciences.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(expressValidator());

require("./services/connection");

var publicRoutes = require("./routes/public");
var login = require("./routes/login");
var adminLogin = require('./routes/adminLogin');
var admin = require('./routes/admin');
var user = require('./routes/user');

app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'express-session secret' }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/public', publicRoutes);
app.use('/api/v1/login', login);
app.use('/api/v1/adminlogin', adminLogin);
app.use('/api/v1/admin', passport.authenticate('admin-token', { session: false }), admin);
app.use('/api/v1/user', passport.authenticate('user-token', { session: false }), user);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.use(function(req, res, next) {
    next(createError(404, "Invalid API. Use the official documentation to get the list of valid APIS."));
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status).json({
        success: false,
        message: err.message,
    });
});

module.exports = app;
