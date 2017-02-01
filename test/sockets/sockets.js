'use strict';

const config = require(process.cwd() + '/config')('testClient');
const include = config.include;

const request = require('supertest');
const assert = require('assert');

const req = request(config.serverUrl);

let Users;

include('test/util/createUsers')((ret) => {
  Users = ret;
});

describe('socket', function () {

  let loginStuff;
  let channelId;

  it('login', function (done) {
    include('test/util/login.js')('bob@gmail.com', 'p1', (ls, err) => {
      loginStuff = ls;
      done(err);
    });
  });

  it('create a channel', function (done) {
    req.post('/api/channels')
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

  describe('create a socket', function () {

    it('baaaa', function (done) {
      let WS = require('ws');
      socket1 = new WS('wss://localhost:3000/api/channels?token=' +
        loginStuff.token, {}, {});
      socket1.on('message', function msg(message) {
        console.log('got one ' + JSON.stringify(message));
        done();
      });
    });
  });
});

it('add message to a channel', function (done) {
  let call = req.post('/api/channels/' + channelId + '/messages');
  call.cookies = cookie1;
  call.send({
      'message': 'this is a message see if user 2 gets it'
    })
    .expect(200)
    .end(function (err, res) {
      newMessageResult = res.body;
      done(err);
    });
});


/*

  it('get channels for a user', function (done) {
    req.get('/api/channels/foruser/' + Users[0]._id)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        assert.equal(res.body.length, 0, 'no channels yet');
        done(err);
      });
  });

  it('get channels for user 0', function (done) {
    req.get('/api/channels/foruser/' + Users[0]._id)
      .expect(200)
      .end(function (err, res) {
        channelId = res.body[0]._id;
        done(err);
      });
  });

  it('create the sockets', function (done) {

    let WebSocket = require('ws');
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
    let WebSocket = require('ws');
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
    let call = req.post('/api/channels/' + channelId + '/messages');
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
  */
