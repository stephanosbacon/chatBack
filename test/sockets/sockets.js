'use strict';

const config = require(process.cwd() + '/config')('testClient');
const include = config.include;

const request = require('supertest');
const assert = require('assert');
const models = include('models/mongoose.js');

const req = request(config.serverUrl);


let Users;

include('test/util/createUsers')((ret) => {
  Users = ret;
});

describe('socket tests', function () {

  let loginStuff1;
  let channelId1;
  let socket1;

  after(function (done) {
    let promise1 = models.ChannelModel.mongooseModel.remove({
        _id: channelId1
      })
      .exec();
    let promisesPromises = Users.map((user) => {
      return models.UserModel.remove({
          _id: user._id
        })
        .exec();
    });

    promisesPromises.push(promise1);
    Promise.all(promisesPromises)
      .then(() => {
        models.UserModel.find({
            _id: Users[0]._id
          })
          .exec((err, obj) => {
            // Just check that at least one was deleted
            assert.equal(err, null);
            assert.equal(obj.length, 0);
            models.ChannelModel.mongooseModel.findOne({
                _id: channelId1
              })
              .exec((err, obj) => {
                assert.equal(err, null);
                assert.equal(obj, null);
                done();
              });
          });
      });
  });


  it('login', function (done) {
    const login = include('test/util/login.js');
    login(Users[0].email, Users[0].password, (ls, err) => {
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
        channelId1 = res.body._id;
        done(err);
      });
  });

  it('create a socket', function (done) {
    let WS = require('ws');
    socket1 = new WS(config.webSocketUrl + loginStuff1.token, {}, {});
    socket1.on('error', (error) => {
      console.log(error);
    });
    done();
  });

  it('add message to a channel', function (done) {
    let validator = function (message) {
      let msg = JSON.parse(message);
      assert.equal(msg.text, 'this is a message');
      assert.equal(msg.postedBy, Users[0]._id);
      assert.notEqual(msg.postedTime, null);
      assert.equal(msg.channelId, channelId1);
      socket1.close();
      socket1 = null;
      done();
    };
    socket1.on('message', validator);
    req.post('/api/channels/' + channelId1 + '/messages')
      .set('Authorization', loginStuff1.token)
      .send({
        'message': 'this is a message'
      })
      .expect(201)
      .end((err, res) => {
        assert.equal(err, null);
        let msg = res.body;
        assert.equal(msg.text, 'this is a message');
        assert.equal(msg.postedBy, Users[0]._id);
        assert.notEqual(msg.postedTime, null);
        assert.equal(msg.channelId, channelId1);
      });
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
