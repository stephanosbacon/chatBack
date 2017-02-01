'use strict';

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

let request = require('supertest');
let assert = require('assert');

let req = request(config.serverUrl);
let Users;

include('test/util/createUsers')((ret) => {
  Users = ret;
});


describe('Test /api/channels', function () {

  let channelId;
  it('clear channels', function (done) {
    include('test/util/clearChannels')(done);
  });

  it('create a channel - expect fail, no login', function (done) {
    req.post('/api/channels')
      .send({
        'users': [Users[0]._id, Users[1]._id],
        'name': 'A channel'
      })
      .expect(401)
      .end(function (err) {
        done(err);
      });
  });

  it('get all channels - expect fail, no login', function (done) {
    req.get('/api/channels')
      .expect(401)
      .end(function (err) {
        done(err);
      });
  });

  let loginStuff1;

  it('login', function (done) {
    include('test/util/login.js')('bob@gmail.com', 'p1', (ls, err) => {
      loginStuff1 = ls;
      done(err);
    });
  });

  it('create a channel', function (done) {
    req.post('/api/channels')
      .set('Authorization', loginStuff1.token)
      .send({
        'users': [Users[0]._id, Users[1]._id],
        'name': 'A channel'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        assert.equal(res.body.message, 'Channel A channel created');
        channelId = res.body._id;
        done(err);
      });
  });

  it('create a channel - not including authorized user - expect fail',
    function (done) {
      req.post('/api/channels')
        .set('Authorization', loginStuff1.token)
        .send({
          'users': [Users[2]._id, Users[1]._id],
          'name': 'A failed channel'
        })
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function (err, res) {
          assert.equal(res.body.code, 401);
          assert.notEqual(res.body.message, null);
          done(err);
        });
    });

  it('get all channels', function (done) {
    req.get('/api/channels')
      .set('Authorization', loginStuff1.token)
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.length, 1, 'check body length');
        assert.equal(res.body[0]._id, channelId);
        assert.equal(res.body[0].name, 'A channel');
        assert.equal(res.body[0].users.length, 2, '2 users');
        assert.equal(res.body[0].users[0], Users[0]._id);
        done(err);
      });
  });

  it('get channels for a user', function (done) {
    req.get('/api/channels/foruser/' + Users[0]._id)
      .set('Authorization', loginStuff1.token)
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.length, 1, 'only one channel');
        assert.equal(res.body[0]._id, channelId, 'verify channel id');
        done(err);
      });
  });

  it('get channels for another user - expect fail', function (done) {
    req.get('/api/channels/foruser/' + Users[1]._id)
      .set('Authorization', loginStuff1.token)
      .expect(401)
      .end(function (err, res) {
        assert.equal(res.body.code, 401);
        done(err);
      });
  });

  /*

  let newMessageResult;
  let cookie;

  it('do a login', function (done) {
    req.post('/api/users/login')
      .send({
        'email': Users[0].email
      })
      .expect(200)
      .end(function (err, res) {
        cookie = res.headers['set-cookie'][0];
        done(err);
      });
  });

  it('add message to a channel', function (done) {
    let call = req.post('/api/channels/' + channelId + '/messages');
    call.cookies = cookie;
    call.send({
        'message': 'this is a message'
      })
      .expect(200)
      .end(function (err, res) {
        newMessageResult = res.body;
        done(err);
      });
  });

  it('verify that the message was added', function (done) {
    req.get('/api/channels/' + channelId + '/messages')
      .expect(200)
      .end(function (err, res) {
        assert(res.body.messages.length === 1, 'single message returned');
        assert(res.body.messages[0].postedBy === Users[0]._id,
          'verify postedBy');
        assert(res.body.messages[0].text === 'this is a message',
          'verify text');
        assert(res.body.messages[0].postedTime ===
          newMessageResult.message.postedTime);
        assert(new Date(res.body.messages[0].postedTime) !==
          'Invalid Date', 'make sure we got back a date');
        done(err);
      });
  });

  it('add a user to a channel', function (done) {
    req.put('/api/channels/' + channelId + '/users/' + Users[2]._id)
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.channelId, channelId);
        assert.equal(res.body.message, 'user ' + Users[2]._id + ' added');
        done(err);
      });
  });

  it('verify that the user was added', function (done) {
    req.get('/api/channels/' + channelId + '/users')
      .expect(200)
      .end(function (err, res) {
        assert(res.body.users.length === 3);
        done(err);
      });

  });

  it('try dummy route', function (done) {
    req.get('/api/channels/dummy')
      .expect(403)
      .end(function (err, res) {
        assert.equal(res.body.message, 'unknown url');
        done(err);
      });
  });
  */
});
