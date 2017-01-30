'use strict';

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

let request = require('supertest');
let assert = require('assert');

let models = include('models/mongoose.js');

let req = request(config.serverUrl);

describe('Test local authentication/authorization - 1', function () {

  it('clear users', function (done) {
    let clearUsers = include('test/util/clearUsers');
    clearUsers(done);
  });

  it('register a user', function (done) {
    let u1 = {
      email: 'foo@bar.com',
      firstName: 'WC',
      lastName: 'Fields',
      status: 'Alive and well and living in Brooklyn',
      password: 'Mart1n1',
      authentication: 'Local'
    };

    models.UserModel.register(u1, function (status, user) {
      assert.equal(user.profile.firstName, 'WC', 'validate first name');
      assert.equal(user.profile.lastName, 'Fields', 'validate last name');
      assert.equal(user.profile.status,
        'Alive and well and living in Brooklyn', 'validate status');
      assert.notEqual(user.password,
        'Mart1n1', 'validate-ish password encryption');
      assert.equal(user.email, 'foo@bar.com', 'validate email');
      assert.equal(status.code, 201);
      done();
    });
  });

  let loginStuff;

  it('login', function (done) {
    include('test/util/login.js')('foo@bar.com', 'Mart1n1', (ls, err) => {
      loginStuff = ls;
      done(err);
    });
  });

  it('test auth - list users', function (done) {
    req.get('/api/users')
      .set('Authorization', loginStuff.token)
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body[0].email, 'foo@bar.com');
        done();
      });
  });

  it('test auth - fetch single user', function (done) {
    req.get('/api/users/' + loginStuff.user._id)
      .set('Authorization', loginStuff.token)
      .expect(200)
      .end((err, res) => {
        assert.equal(res.body.email, 'foo@bar.com');
        done();
      });
  });

  it('test auth - list users - negative test', function (done) {
    req.get('/api/users')
      .expect(401);
    done();
  });

  let secondUser;

  it('Create another user via a post', function (done) {
    // First, create a second user
    let u1 = {
      email: 'foo2@bar2.com',
      firstName: 'WC',
      lastName: 'Fields Jr.',
      status: 'Alive and well and living in Queens',
      password: 'Georgie',
      authentication: 'Local'
    };

    req.post('/api/users')
      .send(u1)
      .expect(201)
      .end((err, res) => {
        secondUser = res;
        done(err);
      });
  });

  it('test auth - fetch single user - authorization fail', function (done) {
    req.get('/api/users/' + secondUser._id)
      .set('Authorization', loginStuff.token)
      .expect(401);
    done();
  });
});




/*

let firstUserId;
it('simple get', function (done) {
  req.get('/api/users')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      done(err);
    });
});

it('add a user', function (done) {
  req.post('/api/users')
    .send({
      'name': 'Bob',
      'email': 'Bob@gmail.com',
      'status': 'hi everyone!'
    })
    .expect(200)
    .expect(function (res) {
      assert.equal(res.body.message, 'saved');
    })
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      firstUserId = res.body._id;
      done(err);
    });

});

it('fetch the new user', function (done) {
  req.get('/api/users/' + firstUserId)
    .expect(200)
    .expect(function (res) {
      assert.equal(res.body.name, "Bob", "name is wrong");
      assert.equal(res.body.email, "Bob@gmail.com", "email is wrong");
      assert.equal(res.body.status, "hi everyone!", "status is wrong");
      assert.equal(res.body.username, "Bob__gmail__com",
      "username is wrong" + res.body.username);
    })
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      done(err);
    });

});

it('fetch all Users', function (done) {
  req.get('/api/users')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      assert(res.body.length == 1);
      done(err);
    });
});

it('fetch non existent user', function (done) {
  req.get('/api/users/12345')
    .expect(500)
    .expect(function (res) {
      assert.equal(res.body.message, 'Error getting or saving object');
    })
    .end(function (err, res) {
      if (err) {
        throw err;

      }
      done(err);
    })
});


it('verify unique email', function (done) {
  req.post('/api/users')
    .send({
      'name': 'Bob',
      'email': 'Bob@gmail.com',
      'status': 'hi everyone!'
    })
    .expect(500)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      done(err);
    });

});
*/
