var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var index = require('./app/routes/index');
var users = require('./app/routes/users');
var ensureAuthenticated = require('./app/services/ensureAuthenticated');

//mongoose promise deprecation
// mongoose.Promise = global.Promise;
mongoose.connect(config.db.url);
mongoose.connection.on('error', function(err) {
	console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`'.red);
});

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'WsmRHJbDbTnBLQPT' })); // secret is random string

// app.use('/', index);
app.use('/api/users', users);
// app.use('/auth', express.static(path.join(__dirname, 'public/index.html')));
// app.use(express.static(path.join(__dirname, 'public')));
app.all('/dashboard*', ensureAuthenticated, function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.use('/libs', express.static(path.join(__dirname, '/public/libs')));
app.use('/angular', express.static(path.join(__dirname, '/public/angular')));
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
