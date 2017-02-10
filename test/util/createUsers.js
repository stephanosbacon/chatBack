'use strict';

const config = require(process.cwd() + '/config')('testClient');
const include = config.include;

const request = require('supertest');
const assert = require('assert');
const gensym = require('randomstring');

const models = include('models/mongoose.js');

const req = request(config.serverUrl);

const cs = {
  length: 10,
  capitalization: 'lowercase'
};

let UsersToCreate = [{
    'email': gensym.generate(cs) + '@gmail.com',
    'firstName': 'bob',
    'lastName': 'smith',
    'status': 'new dood',
    'password': 'p1',
    'authentication': 'Local'
  },
  {
    'email': gensym.generate(cs) + '@gmail.com',
    'firstName': 'sandy',
    'lastName': 'smith',
    'status': 'noo doodette',
    'password': 'p2',
    'authentication': 'Local'
  },
  {
    'email': gensym.generate(cs) + '@gmail.com',
    'firstName': 'billy',
    'lastName': 'smith',
    'status': 'the dude',
    'password': 'p3',
    'authentication': 'Local'
  },
  {
    'email': gensym.generate(cs) + '@gmail.com',
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
      include('test/util/login.js')(Users[0].email, Users[0].password,
        (ls, err) => {
          loginStuff = ls;
          done(err);
        });
    });

    it('verify users created', function (done) {
      req.get('/api/users/' + Users[0]._id)
        .set('Authorization', loginStuff.token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          assert.equal(res.body._id, Users[0]._id);
          callback(Users);
          done(err);
        });
    });
  });
};
