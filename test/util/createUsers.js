'use strict';

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

let request = require('supertest');
let assert = require('assert');

let models = include('models/mongoose.js');

let req = request(config.serverUrl);

let UsersToCreate = [{
    'email': 'bob@gmail.com',
    'firstName': 'bob',
    'lastName': 'smith',
    'status': 'new dood',
    'password': 'p1',
    'authentication': 'Local'
  },
  {
    'email': 'sandy@gmail.com',
    'firstName': 'sandy',
    'lastName': 'smith',
    'status': 'noo doodette',
    'password': 'p2',
    'authentication': 'Local'
  },
  {
    'email': 'billy@gmail.com',
    'firstName': 'billy',
    'lastName': 'smith',
    'status': 'the dude',
    'password': 'p3',
    'authentication': 'Local'
  },
  {
    'email': 'betty@gmail.com',
    'firstName': 'betty',
    'lastName': 'smith',
    'status': 'the dudette',
    'password': 'p4',
    'authentication': 'Local'
  }
];

module.exports = function (callback) {
  let Users = [];

  describe('Create Users', function () {

    it('clear users', function (done) {
      let clearUsers = include('test/util/clearUsers');
      clearUsers(done);
    });

    it('create users', function (done) {
      let closure = function () {
        let count = 0;
        return function (user) {
          models.UserModel.register(user,
            function (status, createdUser) {
              assert.equal(status.code, 201);
              assert.notEqual(createdUser, null);
              createdUser.password = user.password;
              Users.push(createdUser);

              count++;
              if (count === 4) {
                done();
              }
            });
        };
      };
      UsersToCreate.forEach(closure());
    });

    let loginStuff;

    it('login', function (done) {
      include('test/util/login.js')('bob@gmail.com', 'p1', (ls, err) => {
        loginStuff = ls;
        done(err);
      });
    });

    it('verify all users created', function (done) {
      req.get('/api/users')
        .set('Authorization', loginStuff.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          assert(res.body.length === 4);
          callback(Users);
          done(err);
        });
    });
  });
};
