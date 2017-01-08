"use strict";

var request = require('supertest');
var should = require('should');
var express = require('express');
var assert = require('assert');
var models = require('../../models/mongoose.js');

var request = request('https://localhost:3000');

describe('Test /api/users', function () {
  var firstUserId;

  it('clear', function (done) {
    models.UserModel.find({})
      .remove()
      .then(done());
  });

  it('simple get', function (done) {
    request.get('/api/users')
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
    request.post('/api/users')
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
    request.get('/api/users/' + firstUserId)
      .expect(200)
      .expect(function (res) {
        assert.equal(res.body.name, "Bob", "name is wrong");
        assert.equal(res.body.email, "Bob@gmail.com", "email is wrong");
        assert.equal(res.body.status, "hi everyone!", "status is wrong");
        assert.equal(res.body.username, "Bob__gmail__com", "username is wrong" + res.body.username);
      })
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        done(err);
      });

  });

  it('fetch all Users', function (done) {
    request.get('/api/users')
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
    request.get('/api/users/12345')
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
    request.post('/api/users')
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

});
