'use strict';

const config = require(process.cwd() + '/config')('testClient');
const include = config.include;

const request = require('supertest');
const assert = require('assert');

const req = request(config.serverUrl);

const auth = include('auth/passport');
const verifyJwtToken = auth.verifyJwtToken;

module.exports = function (email, password, cb) {
  req.post('/api/users/login')
    .send({
      'email': email,
      'password': password
    })
    .expect(200)
    .end((err, res) => {
      assert.equal(err, null);
      assert.equal(verifyJwtToken(res.body.token)
        ._id, res.body.user._id);
      assert.equal(res.body.token.startsWith('JWT '), true);
      assert.equal(res.body.user.email, email);
      cb(res.body, err);
    });
};
