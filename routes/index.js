'use strict';

// const debug = require('debug')('chatBack/routes/index');

module.exports = function (app) {
  app.all('*', function (req, res, next) {
    next();
  });

  // Insert routes below
  app.use('/api/users', require('./users'));
  app.use('/api/channels', require('./channels'));
};
