"use strict";

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

let request = require('supertest');
let should = require('should');
let express = require('express');
let assert = require('assert');

let models = include('models/mongoose.js');

let req = request(config.serverUrl);

module.exports = function (callback) {
  let Users;

  describe('Create Users', function () {
    it('clear users', function (done) {
      models.UserModel.find({})
        .remove()
        .then(models.UserModel.find({}, (err, docs) => {
          assert.equal(null, err);
          done(err);
        }));
    });

    it('create users', function (done) {
      let count = 0;
      let sayDone = function (err) {
        count++;
        if (count == 4) {
          done(err);
        }
      };

      models.UserModel.create({
          "email": "bob@gmail.com",
          "name": "bob"
        },
        function (err, User) {
          assert.equal(err, null);
          assert.notEqual(User, null);
          sayDone(err);
        });

      models.UserModel.create({
          "email": "sandy@gmail.com",
          "name": "sandy"
        },
        function (err, User) {
          assert.equal(err, null);
          assert.notEqual(User, null);
          sayDone(err);
        });

      models.UserModel.create({
          "email": "billy@.com",
          "name": "billy"
        },
        function (err, User) {
          assert.equal(err, null);
          assert.notEqual(User, null);
          sayDone(err);
        });

      models.UserModel.create({
          "email": "betty@.com",
          "name": "betty"
        },
        function (err, User) {
          assert.equal(err, null);
          assert.notEqual(User, null);
          sayDone(err);
        });
    });

    it('verify all users created', function (done) {
      req.get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          Users = res.body;
          assert(Users.length == 4);
          callback(Users);
          done(err);
        });
    });
  });
}
