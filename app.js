var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sass = require("node-sass");
var nodeSassMiddleware = require("node-sass-middleware");
var winston = require("winston");


winston.level = "debug";



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var editorRouter = require('./routes/editor');

var app = express();

// Convert to SCSS
app.use(
  nodeSassMiddleware({
      src: __dirname + '/assets', //where the sass files are 
      dest: __dirname + '/public', //where css should go
      debug: true, // obvious,
      log: function(severity, key, value){
        // console.log("Sass Middleware log information")
        // console.log(severity)
        // console.log(key,)
        // winston.log(severity, "node sass middleware %s %s", key, value);
      },
      error: function(){
        // console.log("Error information...")
        // console.log(arguments)

      },
      beepOnError: true,
      outputStyle: "compressed"
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'videos')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/editor', editorRouter);

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
