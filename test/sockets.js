var request = require('supertest');
var should = require('should');
var express = require('express');
var assert = require('assert');

var request = request('https://localhost:3000');

var models = require('../models/mongoose.js');

var Users;
require('./util/createUsers')((ret) => {
  Users = ret;
});

describe('socket', function () {

  let cookie1,
    cookie2,
    user1,
    user2,
    channelId,
    newMessageResult,
    socket1,
    socket2;

  it('do the logins', function (done) {

    request.post('/api/users/login')
      .send({
        'email': Users[0].email
      })
      .expect(200)
      .end(function (err, res) {
        cookie1 = res.headers['set-cookie'][0];
        user1 = res.body;
      });

    request.post('/api/users/login')
      .send({
        'email': Users[1].email
      })
      .expect(200)
      .end(function (err, res) {
        cookie2 = res.headers['set-cookie'][0];
        user2 = res.body;
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
        assert.equal(res.body.length, 0, 'no channels yet');
        done(err);
      });
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

  it('get channels for user 0', function (done) {
    request.get('/api/channels/foruser/' + Users[0]._id)
      .expect(200)
      .end(function (err, res) {
        channelId = res.body[0]._id;
        done(err);
      });
  });

  it('create the sockets', function (done) {

    var WebSocket = require('ws');
    socket1 = new WebSocket('https://localhost:3000/api/channels', {}, {
      headers: JSON.stringify(user1)
    });
    socket2 = new WebSocket('https://localhost:3000/api/channels', {}, {
      headers: JSON.stringify(user2)
    });

    socket1.on('open', function open() {
      socket1.send(JSON.stringify(user1));
      socket2.on('open', function open() {
        socket2.send(JSON.stringify(user2));
        done();
      });
    });
  });

  it('assert that sockets are set up', function (done) {
    var WebSocket = require('ws');
    assert.equal(socket1.readyState, WebSocket.OPEN);
    assert.equal(socket2.readyState, WebSocket.OPEN);
    done();
  });

  it('set up on message handlers to test broadcasting', function (done) {

    socket1.on('message', function (data, flags) {
      // console.log('on socket2: ' + data);
      assert.equal(data.postedBy, user2);
      assert.equal(data.message,
        'this is a message see if user 1 gets it');
    });

    socket2.on('message', function (data, flags) {
      //console.log('on socket2: ' + data);
      assert.equal(data.postedBy, user1);
      assert.equal(data.message,
        'this is a message see if user 2 gets it');
    });

    done();
  });

  it('add message to a channel', function (done) {
    let call = request.post('/api/channels/' + channelId + '/messages');
    call.cookies = cookie1;
    call.send({
        'message': 'this is a message see if user 2 gets it'
      })
      .expect(200)
      .end(function (err, res) {
        newMessageResult = res.body;
        done(err)
      });
  });

  it('add message to a channel', function (done) {
    let call = request.post('/api/channels/' + channelId + '/messages');
    call.cookies = cookie2;
    call.send({
        'message': 'this is a message see if user 1 gets it'
      })
      .expect(200)
      .end(function (err, res) {
        newMessageResult = res.body;
        done(err)
      });
  });
});
