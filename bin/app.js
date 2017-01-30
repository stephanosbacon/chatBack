'use strict';

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
include('models/mongoose.js');
include('auth/passport.js');

let Status = include('util/status');

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());

include('routes')(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

app.use((err, req, res, next) => {
  if (err) {
    console.log(err);
    next(err);
  }
  console.log('Should be returning 403');
  res.status(403)
    .json(new Status(403, 'unknown url'))
    .end();
});

module.exports = app;
