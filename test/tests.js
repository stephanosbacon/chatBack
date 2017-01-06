"use strict";

var request = require('supertest');
var should = require('should');
var express = require('express');
var assert = require('assert');

request = request('http://localhost:3000');

var models = require('../models/mongoose.js');

describe('Test /api/users', function () {

  var firstUserId;

  it('clear', function (done) {
    models.UserModel.find({}).remove().then(done());
  });

  it('simple get', function (done) {
    request.get('/api/users').expect('Content-Type', /json/).expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        done();
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
        done();
      });

  });

  it('fetch the new user', function (done) {
    request.get('/api/users/' + firstUserId).expect(200)
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
        done();
      });

  });

  it('fetch all Users', function (done) {
    request.get('/api/users').expect('Content-Type', /json/).expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        assert(res.body.length == 1);
        done();
      });
  });

  it('fetch non existent user', function (done) {
    request.get('/api/users/12345').expect(500).expect(function (res) {
      assert.equal(res.body.message, 'Error getting or saving object');
    }).end(function (err, res) {
      if (err) {
        throw err;

      }
      done();
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
        done();
      });

  });

});

describe('Test /api/channels', function () {

  var channelId;
  var Users;

  it('clear users', function (done) {
    models.UserModel.find({}).remove().then(done());
  });

  it('clear channels', function (done) {
    models.ChannelModel.find({}).remove().then(done());
  });

  it('create users', function (done) {

    var count = 0;
    var sayDone = function () {
      count++;
      if (count == 4) {
        done();
      }
    };

    models.UserModel.create(
      {
        "email": "bob@gmail.com",
        "name": "bob"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });

    models.UserModel.create(
      {
        "email": "sandy@gmail.com",
        "name": "sandy"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });

    models.UserModel.create(
      {
        "email": "billy@.com",
        "name": "billy"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });

    models.UserModel.create(
      {
        "email": "betty@.com",
        "name": "betty"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });
  });

  it('verify all users created', function (done) {
    request.get('/api/users').expect('Content-Type', /json/).expect(200)
      .end(function (err, res) {
        Users = res.body;
        assert(Users.length == 4);
        done();
      });
  });


  it('create a channel', function (done) {
    request.post('/api/channels')
      .send({
        'users': [Users[0]._id, Users[1]._id],
        'name': 'A channel'
      })
      .expect('Content-Type', /json/).expect(200)
      .end(function (err, res) {
        assert.equal(res.body.message, "Channel A channel created");
        channelId = res.body.channelId;
        done();
      });
  });

  it('get all channels', function (done) {
    request.get('/api/channels').expect(200)
      .end(function (err, res) {
        assert.equal(res.body.length, 1, 'check body length');
        assert.equal(res.body[0]._id, channelId);
        assert.equal(res.body[0].name, 'A channel');
        assert.equal(res.body[0].users.length, 2, '2 users');
        assert.equal(res.body[0].users[0], Users[0]._id);
        done();
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
        done();
      });
  });

  let newMessageResult;
  let cookie;

  it('do a login', function (done) {
    request.post('/api/users/login')
      .send({'email': Users[0].email})
      .expect(200)
      .end(function (err, res) {
        cookie = res.headers['set-cookie'][0];
        done();
      })
  });

  it('add message to a channel', function (done) {
    let call = request.post('/api/channels/' + channelId + '/messages');
    call.cookies = cookie;
    call.send({'message': 'this is a message'})
      .expect(200)
      .end(function (err, res) {
        newMessageResult = res.body;
        done()
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
        done();
      });
  });

  it('add a user to a channel', function (done) {
    request.put('/api/channels/' + channelId + '/users/' + Users[2]._id)
      .expect(200)
      .end(function (err, res) {
        assert.equal(res.body.channelId, channelId);
        assert.equal(res.body.message, 'user ' + Users[2]._id + ' added');
        done();
      });
  });

  it('verify that the user was added', function (done) {
    request.get('/api/channels/' + channelId + '/users')
      .expect(200)
      .end(function (err, res) {
        assert(res.body.users.length == 3);
        done();
      });

  });

  it('try dummy route', function (done) {
    request.get('/api/channels/dummy').expect(403).end(function (err, res) {
      assert.equal(res.body.message, 'unknown url');
      done();
    });
  });

});

describe('socket', function () {

  let cookie1,
      cookie2,
      user1,
      user2,
      channelId,
      newMessageResult,
      socket1,
      socket2,
      Users;

  it('clear users', function (done) {
    models.UserModel.find({}).remove().then(done());
  });

  it('clear channels', function (done) {
    models.ChannelModel.find({}).remove().then(done());
  });

  it('create users', function (done) {

    var count = 0;
    var sayDone = function () {
      count++;
      if (count == 4) {
        done();
      }
    };

    models.UserModel.create(
      {
        "email": "bob@gmail.com",
        "name": "bob"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });

    models.UserModel.create(
      {
        "email": "sandy@gmail.com",
        "name": "sandy"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });

    models.UserModel.create(
      {
        "email": "billy@.com",
        "name": "billy"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });

    models.UserModel.create(
      {
        "email": "betty@.com",
        "name": "betty"
      },
      function (err, User) {
        assert.equal(err, null);
        assert.notEqual(User, null);
        sayDone();
      });
  });

  it('verify all users created', function (done) {
    request.get('/api/users').expect('Content-Type', /json/).expect(200)
      .end(function (err, res) {
        Users = res.body;
        assert(Users.length == 4);
        done();
      });
  });

  it('do the logins', function (done) {
    request.post('/api/users/login')
      .send({'email': Users[0].email})
      .expect(200)
      .end(function (err, res) {
        cookie1 = res.headers['set-cookie'][0];
        user1 = res.body;
      });

    request.post('/api/users/login')
      .send({'email': Users[1].email})
      .expect(200)
      .end(function (err, res) {
        cookie2 = res.headers['set-cookie'][0];
        user2 = res.body;
        done();
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
        done();
      });
  });

  it('create a channel', function (done) {
    request.post('/api/channels')
      .send({
        'users': [Users[0]._id, Users[1]._id],
        'name': 'A channel'
      })
      .expect('Content-Type', /json/).expect(200)
      .end(function (err, res) {
        assert.equal(res.body.message, "Channel A channel created");
        channelId = res.body.channelId;
        done();
      });
  });

  it('get channels for user 0', function (done) {
    request.get('/api/channels/foruser/' + Users[0]._id)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          throw err;
        }

        channelId = res.body[0]._id;
        done();
      });
  });

  it('create the sockets', function (done) {

    var WebSocket = require('ws');
    socket1 = new WebSocket('http://localhost:3000/api/channels', {},
                             { headers : JSON.stringify(user1)});
    socket2 = new WebSocket('http://localhost:3000/api/channels', {},
                             { headers : JSON.stringify(user2)});

    socket1.on('message', function (data, flags) {
      // flags.binary will be set if a binary data is received.
      // flags.masked will be set if the data was masked.
      console.log('on socket1: ' + data);
      assert.equal(){'message': 'this is a message see if user 2 gets it'})

    });

    socket2.on('message', function(data, flags) {
      console.log('on socket2: ' + data);
    });

    socket1.on('open', function open() {
        socket1.send(JSON.stringify(user1));
        socket2.on('open', function open() {
            socket2.send(JSON.stringify(user2));
            done();
        });
    });
  });

  it('assert that sockets are set up', function(done) {
      var WebSocket = require('ws');
      assert.equal(socket1.readyState, WebSocket.OPEN);
      assert.equal(socket2.readyState, WebSocket.OPEN);
      done();
  });

  it('add message to a channel', function (done) {
    let call = request.post('/api/channels/' + channelId + '/messages');
    call.cookies = cookie1;
    call.send({'message': 'this is a message see if user 2 gets it'})
      .expect(200)
      .end(function (err, res) {
        newMessageResult = res.body;
        done()
      });
  });

  it('add message to a channel', function (done) {
    let call = request.post('/api/channels/' + channelId + '/messages');
    call.cookies = cookie2;
    call.send({'message': 'this is a message see if user 1 gets it'})
      .expect(200)
      .end(function (err, res) {
        newMessageResult = res.body;
        done()
      });
  });

});
