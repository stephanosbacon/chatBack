"use strict";

var request = require('supertest');
var should = require('should');
var express = require('express');
var assert = require('assert');
var models = require('../../models/mongoose.js');

var request = request('https://localhost:3000');



require('../util/createUsers')((ret) => {
  Users = ret;
});


describe('Test /api/channels', function () {

  let channelId;

  it('clear channels', function (done) {
    models.ChannelModel.find({})
      .remove()
      .then(done());
  });

  it('create a channel', function (done) {
    request.post('/api/channels')
      .send({
        'users': [Users[0]._id, Users[1]._id],
        'name': 'A channel'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.message, "Channel A channel created");
        channelId = res.body.channelId;
        done(err);
      });
  });

  it('get all channels', function (done) {
    request.get('/api/channels')
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.length, 1, 'check body length');
        assert.equal(res.body[0]._id, channelId);
        assert.equal(res.body[0].name, 'A channel');
        assert.equal(res.body[0].users.length, 2, '2 users');
        assert.equal(res.body[0].users[0], Users[0]._id);
        done(err);
      })
  });

  it('get channels for a user', function (done) {
    request.get('/api/channels/foruser/' + Users[0]._id)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        assert.equal(res.body.length, 1, 'only one channel');
        assert.equal(res.body[0]._id, channelId, 'verify channel id');
        assert.equal(res.body[0].messages.length, 0, 'no messages yet');
        done(err);
      });
  });

  let newMessageResult;
  let cookie;

  it('do a login', function (done) {
    request.post('/api/users/login')
      .send({
        'email': Users[0].email
      })
      .expect(200)
      .end(function (err, res) {
        cookie = res.headers['set-cookie'][0];
        done(err);
      })
  });

  it('add message to a channel', function (done) {
    let call = request.post('/api/channels/' + channelId + '/messages');
    call.cookies = cookie;
    call.send({
        'message': 'this is a message'
      })
      .expect(200)
      .end(function (err, res) {
        newMessageResult = res.body;
        done(err)
      });
  });

  it('verify that the message was added', function (done) {
    request.get('/api/channels/' + channelId + '/messages')
      .expect(200)
      .end(function (err, res) {
        assert(res.body.messages.length == 1, 'single message returned');
        assert(res.body.messages[0].postedBy == Users[0]._id, 'verify postedBy');
        assert(res.body.messages[0].text == 'this is a message', 'verify text');
        assert(res.body.messages[0].postedTime == newMessageResult.message.postedTime);
        assert(new Date(res.body.messages[0].postedTime) != 'Invalid Date', 'make sure we got back a date');
        done(err);
      });
  });

  it('add a user to a channel', function (done) {
    request.put('/api/channels/' + channelId + '/users/' + Users[2]._id)
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.channelId, channelId);
        assert.equal(res.body.message, 'user ' + Users[2]._id + ' added');
        done(err);
      });
  });

  it('verify that the user was added', function (done) {
    request.get('/api/channels/' + channelId + '/users')
      .expect(200)
      .end(function (err, res) {
        assert(res.body.users.length == 3);
        done(err);
      });

  });

  it('try dummy route', function (done) {
    request.get('/api/channels/dummy')
      .expect(403)
      .end(function (err, res) {
        assert.equal(res.body.message, 'unknown url');
        done(err);
      });
  });

});
