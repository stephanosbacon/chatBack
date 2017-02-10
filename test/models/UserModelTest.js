'use strict';


const config = require(process.cwd() + '/config')('testClient');
const include = config.include;

let models = include('models/mongoose.js');

let assert = require('assert');

const gensym = require('randomstring');
const cs = {
  length: 10,
  capitalization: 'lowercase'
};

let u1 = {
  email: gensym.generate(cs) + '@bar.com',
  firstName: 'WC',
  lastName: 'Fields',
  status: 'Alive and well and living in Brooklyn',
  password: 'Mart1n1',
  authentication: 'Local'
};

let u2 = {
  email: gensym.generate(cs) + '@bar.com',
  firstName: 'WC',
  lastName: 'Fields jr.',
  status: 'Alive and well and living in Queens',
  authentication: 'Facebook'
};

describe('Test user model - register', function () {

  after(function (done) {

    models.UserModel.remove({
        'email': {
          $in: [u1.email, u2.email]
        }
      })
      .exec()
      .then(() => {
        models.UserModel.findOne({
            'email': u1.email
          })
          .exec((err, obj) => {
            assert.equal(obj, null);
            assert.equal(err, null);
            done();
          });
      });
  });

  it('register a user', function (done) {
    models.UserModel.register(u1, function (status, user) {
      assert.equal(user.profile.firstName, 'WC', 'validate first name');
      assert.equal(user.profile.lastName, 'Fields', 'validate last name');
      assert.equal(user.profile.status,
        'Alive and well and living in Brooklyn', 'validate status');
      assert.notEqual(user.password,
        'Mart1n1', 'validate-ish password encryption');
      assert.equal(user.email, u1.email, 'validate email');
      assert.equal(status.code, 201);
      done();
    });
  });

  it('register a user - duplicate', function (done) {
    models.UserModel.register(u1, function (status, user) {
      assert.equal(user, null);
      assert.equal(status.code, 422, 'error status 422');
      assert.equal(status.message, 'Email already in use');
      done();
    });
  });

  it('register a user - fb auth, no pw', function (done) {
    models.UserModel.register(u2, function (status, user) {
      assert.notEqual(user, null);
      assert.equal(status.code, 201, 'all is well');
      assert.equal(user.profile.authentication, 'Facebook');
      done();
    });
  });

  it('register a user - missing email', function (done) {
    let u1 = {
      firstName: 'WC',
      lastName: 'Fields jr.',
      status: 'Alive and well and living in Queens',
      authentication: 'Facebook'
    };

    models.UserModel.register(u1, function (status, user) {
      assert.equal(user, null);
      assert.equal(status.code, 422, 'Missing email');
      done();
    });
  });

  it('register a user - missing firstName', function (done) {
    let u1 = {
      email: 'bar@quux.com',
      lastName: 'Fields jr.',
      status: 'Alive and well and living in Queens',
      authentication: 'Facebook'
    };

    models.UserModel.register(u1, function (status, user) {
      assert.equal(user, null);
      assert.equal(status.code, 422, 'Missing firstName');
      done();
    });
  });

  it('register a user - missing lastName', function (done) {
    let u1 = {
      email: 'bar@quux.com',
      firstName: 'William Cromwell',
      status: 'Alive and well and living in Queens',
      authentication: 'Facebook'
    };

    models.UserModel.register(u1, function (status, user) {
      assert.equal(user, null);
      assert.equal(status.code, 422, 'Missing lastName');
      done();
    });
  });

  it('register a user - missing password', function (done) {
    let u1 = {
      email: 'bar@quux.com',
      firstName: 'William Cromwell',
      lastName: 'Fields jr.',
      status: 'Alive and well and living in Queens',
      authentication: 'Local'
    };

    models.UserModel.register(u1, function (status, user) {
      assert.equal(user, null);
      assert.equal(status.code, 422, 'Missing lastName');
      done();
    });
  });

  it('register a user - missing authentication', function (done) {
    let u1 = {
      email: 'bar@quux.com',
      firstName: 'William Cromwell',
      lastName: 'Fields jr.',
      status: 'Alive and well and living in Queens',
      password: 'Mart1n1'
    };

    models.UserModel.register(u1, function (status, user) {
      assert.equal(user, null);
      assert.equal(status.code, 422, 'Missing authentication');
      done();
    });
  });

});

describe('Test user model - update', function () {

  it('register a user', function (done) {
    models.UserModel.register(u1, function (status, user) {
      assert.equal(status.code, 201);
      assert.equal(user.profile.firstName, 'WC', 'validate first name');
      assert.equal(user.profile.lastName, 'Fields', 'validate last name');
      assert.equal(user.profile.status,
        'Alive and well and living in Brooklyn', 'validate status');
      assert.notEqual(user.password,
        'Mart1n1', 'validate-ish password encryption');
      assert.equal(user.email, u1.email, 'validate email');
      done();
    });
  });

  it('test updating', function (done) {
    models.UserModel.findOne({
      email: u1.email
    }, function (err, user) {
      assert.equal(err, null);
      models.UserModel.update({
        _id: user._id,
        email: user.email,
        firstName: 'Jimbob'
      }, function (status, user) {
        assert.equal(status.code, 200, 'all is well');
        assert.equal(user.profile.firstName, 'Jimbob');
        done();
      });
    });
  });
});
