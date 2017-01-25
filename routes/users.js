'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');

let Status = include('/util/status.js');

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', {
  session: false
});
const requireLogin = passport.authenticate('local', {
  session: false
});

function authorizeCurrentUser(req, res, next) {
  if (JSON.stringify(req.params.id) !== JSON.stringify(req.user._id)) {
    res.status(401)
      .json(new Status(401, 'not authorized'))
      .end();
  } else {
    next();
  }
}

var UserController = include('controllers/UserController.js');

router.get('/', requireAuth, UserController.list);
router.get('/:id', requireAuth, authorizeCurrentUser, UserController.show);
router.post('/', UserController.register);
router.post('/login', requireLogin, UserController.login);
router.put('/:id', requireAuth, authorizeCurrentUser, UserController.update);
router.delete('/:id', requireAuth, authorizeCurrentUser, UserController.remove);

router.all('/*', (req, res) => {
  return res.status(403)
    .json({
      'message': 'unknown url'
    });
});

module.exports = router;
