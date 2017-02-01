'use strict';

const express = require('express');
const router = express.Router();
const auth = include('auth/passport.js');
const ChannelController = include('controllers/ChannelController.js');
const ChannelModel = include('models/ChannelModel');
const Status = include('util/status.js');

function setCurrentChannel(req, res, next) {
  ChannelModel.getChannel(req.params.id, (status, channel) => {
    if (status.code !== 200 || channel === null) {
      res.status(status.code)
        .json(status)
        .end();
    } else {
      req.channel = channel;
      next();
    }
  });
}

function isUserInChannel(userId, channelUsers, res, next) {
  if (channelUsers.some((elt) => {
      return elt.toString() === userId.toString();
    })) {
    next();
  } else {
    res.status(401)
      .json(new Status(401, 'Not authorized'))
      .end();
  }
}

function currentUserMustBeInNewChannel(req, res, next) {
  let channelUsers = req.body.users;
  let userId = req.user._id;

  isUserInChannel(userId, channelUsers, res, next);
}

function currentUserInChannel(req, res, next) {
  let channelUsers = req.channel.users;
  let userId = req.user._id;
  isUserInChannel(userId, channelUsers, res, next);
}

function usersCanOnlyRemoveThemselves(req, res, next) {
  if (req.user._id === req.params.userId) {
    next();
  } else {
    res.status(401)
      .json(new Status(401, 'Not authorized'))
      .end();
  }
}

// must be logged in
router.get('/', auth.requireAuth, ChannelController.getAllChannels);

// must be logged in, one of the users must be the logged in user
router.post('/', auth.requireAuth, currentUserMustBeInNewChannel,
  ChannelController.create);

// must be logged in and be one of the users in the channel
router.get('/:id/users',
  auth.requireAuth,
  setCurrentChannel, currentUserInChannel, ChannelController.showUsers);

// must be logged in, and must be the user specified by :id
router.get('/foruser/:id',
  auth.requireAuth, auth.authorizeCurrentUser,
  ChannelController.getChannelsForUser);

// must be logged in and be one of the users in the channel
router.get('/:id/messages',
  auth.requireAuth, setCurrentChannel,
  currentUserInChannel, ChannelController.showMessages);
router.post('/:id/messages',
  auth.requireAuth, setCurrentChannel,
  currentUserInChannel, ChannelController.addMessageToChannel);

// must be logged in.  In order to add a user to a channel,
// the user must also be one of the users in the channel
router.put('/:id/users/:userid', auth.requireAuth, setCurrentChannel,
  currentUserInChannel,
  ChannelController.addUserToChannel);

// must be logged in, and users can only remove themselves (so :userid has to
// be the login id)
router.delete('/:id/users/:userid',
  auth.requireAuth,
  setCurrentChannel,
  currentUserInChannel,
  usersCanOnlyRemoveThemselves,
  ChannelController.removeUserFromChannel);

router.all('/*', (req, res) => {
  return res.status(403)
    .json({
      'message': 'unknown url'
    });
});

module.exports = router;
