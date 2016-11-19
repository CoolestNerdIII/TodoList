var express = require('express');
var app = express(); // create app with express
var mongoose = require('mongoose'); // mongoose for mongodb
var passport = require('passport');
var flash = require('connect-flash');
var port     = process.env.PORT || 8080;                // set the port
var server = require('http').createServer(app);

var morgan = require('morgan');  // log requests to the console
var bodyParser = require('body-parser'); // pull information from HTML POST
var cookieParser = require('cookie-parser');
var session = require('express-session');

var methodOverride = require('method-override'); // simulate DELETE and PUT
var configDB = require('./config/database');
require('./config/passport')(passport); // pass passport for configuration

mongoose.connect(configDB.url);

app.use(express.static(__dirname + '/public'));  // set static file location
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({secret: 'ilovescotchscotchyscotchscotch'}));  // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ==========
require('./app/routes')(app, passport); // load our routes and pass in our fully configured passport

// launch ==========
// app.listen(port);
server.listen(port);
console.log("App listening on port 8080");
