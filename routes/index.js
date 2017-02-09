'use strict';

// const debug = require('debug')('chatBack/routes/index');

module.exports = function (app) {
  app.all('*', function (req, res, next) {
    next();
  });

  app.use('/api/health/ping', function (req, res) {
    res.send('hello world!');
  });

  app.use('/api/health/mongo', function (req, res) {
    const UserModel = include('models/mongoose.js')
      .UserModel;
    const u1 = {
      email: 'foo@bar.com',
      firstName: 'WC',
      lastName: 'Fields',
      status: 'Alive and well and living in Brooklyn',
      password: 'Mart1n1',
      authentication: 'Local'
    };

    console.log('calling remove ');
    UserModel.remove({
      profile: {
        email: u1.email
      }
    }, (err) => {
      console.log(err);
      UserModel.register(u1, (status, user) => {
        console.log(status);
        console.log(user);
        if (user == null) {
          console.log('user is null ');
          res.status(status.code)
            .json(status)
            .end();
        }
      });
    });
  });


  app.use('/api/users', include('routes/users.js'));
  app.use('/api/channels', include('routes/channels.js'));
  app.use('/favicon.ico', (req, res) => {
    res.status(200)
      .end();
  });
};
