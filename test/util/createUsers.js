"use strict";

var request = require('supertest');
var should = require('should');
var express = require('express');
var assert = require('assert');
var models = require('../../models/mongoose.js');

var request = request('https://localhost:3000');

module.exports = function (callback) {
  var Users;

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
      var count = 0;
      var sayDone = function (err) {
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
      request.get('/api/users')
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
