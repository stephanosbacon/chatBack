'use strict';

let config = require(process.cwd() + '/config')('testClient');

let request = require('supertest');
let assert = require('assert');

let req = request(config.serverUrl);

module.exports = function (email, password, cb) {
  req.post('/api/users/login')
    .send({
      'email': email,
      'password': password
    })
    .expect(200)
    .end((err, res) => {
      assert.equal(res.body.token.startsWith('JWT '), true);
      assert.equal(res.body.user.email, email);
      cb(res.body, err);
    });
};
