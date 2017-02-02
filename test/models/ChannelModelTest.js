'use strict';

let config = require(process.cwd() + '/config')('testClient');
let include = config.include;

let models = include('models/mongoose.js');

let assert = require('assert');

let Users;

include('test/util/createUsers')((ret) => {
  Users = ret;
});



describe('Test Channel Model', function () {

  it('clear channels', function (done) {
    include('test/util/clearChannels')(done);
  });

  let newChannelId;

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
      assert.equal(allChannels.length, 2);
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
        let usersFrob = JSON.parse(JSON.stringify(channel.users));
        assert(usersFrob.includes(Users[2]._id));
        assert.equal(channel.users.length, 3);
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
