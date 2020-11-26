var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var ws = require('ws').Server;

var indexRouter = require('./routes/index');

var app = express();
var socket = new ws({ port : 8080 });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

var connects = [];
var broadcast = (message) => {
  connects.forEach(function(socket) {
    socket.send(message);
  });
}

socket.on('connection', (ws) => {
  connects.push(ws);
  console.log('New Client Connected : ', connects.length);
  ws.on('message', (message) => {
    console.log(message);
    broadcast(message);
  });
  ws.on('close', () => {
    connects = connects.filter((conn) => {
      return (conn === ws) ? 0 : 1;
    });
  })
});

module.exports = app;
