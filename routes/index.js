'use strict';

// const debug = require('debug')('chatBack/routes/index');

module.exports = function (app) {
  app.all('*', function (req, res, next) {
    next();
  });

  // Insert routes below
  app.use('/api/ping', function (req, res) {
    res.send('hello world!');
  });
  app.use('/api/users', include('routes/users'));
  app.use('/api/channels', include('routes/channels'));
};
