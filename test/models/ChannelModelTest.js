'use strict';

const config = require(process.cwd() + '/config')('testClient');
const include = config.include;

const models = include('models/mongoose.js');
const assert = require('assert');
const Promise = require('bluebird');

let Users;
include('test/util/createUsers')((ret) => {
  Users = ret;
});

describe('Test Channel Model', function () {

  let newChannelId;
  let secondChannelId;

  after(function (done) {
    let promise1 = models.ChannelModel.mongooseModel.remove({
        _id: secondChannelId
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
            done();
          });
      });
  });

  it('create a channel', function (done) {
    models.ChannelModel.createChannel({
      users: [Users[0]._id, Users[1]._id],
      name: 'my favorite channel'
    }, function (status, channel) {
      assert.equal(status.code, 201);
      assert.equal(channel.name, 'my favorite channel');
      assert.equal(channel.users[0], Users[0]._id);
      assert.equal(channel.users[1], Users[1]._id);
      newChannelId = channel._id;
      done();
    });
  });

  it('create a second channel', function (done) {
    models.ChannelModel.createChannel({
      users: [Users[1]._id, Users[2]._id],
      name: 'my favorite channel'
    }, function (status, channel) {
      secondChannelId = channel._id;
      assert.equal(status.code, 201);
      assert.equal(channel.name, 'my favorite channel');
      assert.equal(channel.users[0], Users[1]._id);
      assert.equal(channel.users[1], Users[2]._id);
      done();
    });
  });

  it('test get all channels', function (done) {
    models.ChannelModel.getAllChannels((status, allChannels) => {
      assert.equal(status.code, 200);
      let found = false;
      allChannels.forEach((channel) => {
        if (channel._id.toString() === secondChannelId.toString()) found = true;
      });
      assert.equal(found, true);
      done();
    });
  });

  it('test getChannelsForUser', function (done) {
    models.ChannelModel.getChannelsForUser(Users[0]._id, (status, channels) => {
      assert.equal(channels.length, 1, 'one channel');
      assert.equal(channels[0]._id, newChannelId);
      done();
    });
  });

  it('test add user to channel', function (done) {
    models.ChannelModel.addUserToChannel(newChannelId, Users[2]._id,
      (status, channel) => {
        assert.equal(status.code, 201);
        assert(channel.users.some((elt) => {
          return elt.toString() === Users[2]._id.toString();
        }));
        done();
      });
  });

  it('test remove user from a channel', function (done) {
    models.ChannelModel.removeUserFromChannel(newChannelId, Users[1]._id,
      (status, channel) => {
        assert.equal(status.code, 201);
        let usersFrob = JSON.parse(JSON.stringify(channel.users));
        assert(!usersFrob.includes(Users[1]._id));
        assert.equal(channel.users.length, 2);
        done();
      });
  });

  it('test add a message to a channel', function (done) {
    models.ChannelModel.addMessageToChannel(newChannelId,
      Users[0]._id, 'hello world',
      (status, message) => {
        assert.equal(status.code, 201);
        assert.equal(message.text, 'hello world');
        assert.equal(message.channelId, newChannelId);
        assert.equal(message.postedBy, Users[0]._id);
        assert.notEqual(message.postedTime, null);
        done();
      });
  });

  it('test get simple channel', function (done) {
    models.ChannelModel.getSimpleChannel(newChannelId, (status, channel) => {
      assert.equal(channel._id, newChannelId);
      assert.equal(channel.messages, null);
      done();
    });
  });

  it('test get full channel', function (done) {
    models.ChannelModel.getFullChannel(newChannelId, (status, channel) => {
      assert.equal(channel._id, newChannelId);
      assert.equal(channel.messages.length, 1);
      done();
    });
  });

  it('test delete channel', function (done) {
    models.ChannelModel.deleteChannel(newChannelId, (status, channel) => {
      assert.equal(status.code, 201);
      assert.equal(channel._id, newChannelId);
      models.ChannelModel.mongooseModel.findById(newChannelId, (err, obj) => {
        assert(obj == null);
        done();
      });
    });
  });
});
