'use strict';

// const debug = require('debug')('chatBack/routes/index');

module.exports = function (app) {
  app.all('*', function (req, res, next) {
    next();
  });

  app.get('/health/status', function (req, res) {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      res.status(200)
        .send({
          'status': 'all is well, remain calm'
        })
        .end();
    } else {
      res.status(500)
        .send({
          'status': 'no mongo man!',
          'mongoReadyState': mongoose.connection.readyState
        });
    }
  });

  app.use('/api/users', include('routes/users.js'));
  app.use('/api/channels', include('routes/channels.js'));
  app.use('/favicon.ico', (req, res) => {
    res.status(200)
      .end();
  });
};
