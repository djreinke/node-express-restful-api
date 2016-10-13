var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var cors = require('cors');

var config = require('../config');
var port = process.env.PORT || config.port;
var app = express();

app.use(logger('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: '*'
}));

var router = express.Router();
router.get('/',function(req,res){
  res.json({ message: 'API up and running!' });
});

var unauthenticatedRoutes = require('./routes/unauthenticated');
app.use('/api',unauthenticatedRoutes);

var authenticatedRoutes = require('./routes/authenticatedRoutes');
app.use('/api', authenticatedRoutes);

// prefix routes with /api
app.use('/api',router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(port, function(){
  console.log("API started on port " + port);
});

process.on('uncaughtException', function(err){
  console.error(err.stack);
  console.log("Uncaught exception... continuing");
});

module.exports = app;
