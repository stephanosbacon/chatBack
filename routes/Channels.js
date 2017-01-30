'use strict';

var express = require('express');
var router = express.Router();

var ChannelController = include('controllers/ChannelController.js');

// must be logged in
router.get('/', ChannelController.getAllChannels);

// must be logged in and be one of the users in the channel
router.get('/:id/messages', ChannelController.showMessages);
router.post('/:id/messages', ChannelController.addMessageToChannel);

// must be logged in and be one of the users in the channel
router.get('/:id/users', ChannelController.showUsers);

// must be logged in, and must be the user specified by :userid
router.get('/foruser/:userid', ChannelController.getChannelsForUser);

// must be logged in, one of the users must be the logged in user
router.post('/', ChannelController.create);

// must be logged in.  In order to add a user to a channel,
// the user must also be one of the users in the channel
router.put('/:id/users/:userid', ChannelController.addUserToChannel);

// must be logged in, and users can only remove themselves (so :id has to
// be the login id)
router.delete('/:id', ChannelController.removeUserFromChannel);

router.all('/*', (req, res) => {
  return res.status(403)
    .json({
      'message': 'unknown url'
    });
});


module.exports = router;
