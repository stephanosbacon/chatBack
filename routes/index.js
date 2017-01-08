/**
 * Main application routes
 */

'use strict';

var path = require('path');


module.exports = function (app) {
  app.all('*', function (req, res, next) {
    next();
  });

  // Insert routes below
  app.use('/api/users', require('./users'));
  app.use('/api/channels', require('./Channels'));
}
