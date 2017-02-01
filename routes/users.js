'use strict';

const express = require('express');
const router = express.Router();
const auth = include('auth/passport.js');

var UserController = include('controllers/UserController.js');

router.get('/', auth.requireAuth, UserController.list);
router.get('/:id',
  auth.requireAuth, auth.authorizeCurrentUser, UserController.show);
router.post('/', UserController.register);
router.post('/login', auth.requireLogin, UserController.login);
router.put('/:id',
  auth.requireAuth, auth.authorizeCurrentUser, UserController.update);
router.delete('/:id',
  auth.requireAuth, auth.authorizeCurrentUser, UserController.remove);

router.all('/*', (req, res) => {
  return res.status(403)
    .json({
      'message': 'unknown url'
    });
});

module.exports = router;
