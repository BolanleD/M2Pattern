var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
var mongoose = require('mongoose');
const config = require('./config/database');

//Set up mongoose connection
mongoose.connect(config.database, {
  useNewUrlParser: true
});
let db = mongoose.connection;

//Check for DB connection
db.once('open', () => {
  console.log('Connected to mongodb');
});

//Check for DB errors
db.on('error', err => {
  console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'm2patternsecretkey',
  resave: true,
  saveUninitialized: true
}));

//Express Messeges Middleware
app.use(require('connect-flash')());
app.use( (req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


//Express Validator Middleware
app.use(expressValidator());

//Passport config
require('./config/passport')(passport);

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

let users = require('./routes/users');
let indexRouter = require('./routes/index');
let patternRouter = require('./routes/pattern');
app.use('/users', users);
app.use('/', indexRouter);
app.use('/pattern', patternRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
