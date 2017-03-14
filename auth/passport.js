'use strict';

// const debug = require('debug')('chatBack/auth/passport');

// Importing Passport, strategies, and config
const passport = require('passport');
const models = include('models/mongoose.js');
const Status = include('util/status');

const JwtStrategy = require('passport-jwt')
  .Strategy;
const ExtractJwt = require('passport-jwt')
  .ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {
  usernameField: 'email'
};

// Setting up JWT login strategy
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secrets.jwtSecret
};

const jwtToken = require('jsonwebtoken');

const localLogin = new LocalStrategy(localOptions, localStrategyHandler);
const jwtLogin = new JwtStrategy(jwtOptions, jwtStrategyHandler);

passport.use(jwtLogin);
passport.use(localLogin);

function localStrategyHandler(email, password, done) {
  models.UserModel.findOne({
    email: email
  }, function (err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        error: 'Your login details could not be verified. Please try again.'
      });
    }

    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        return done(err);
      }
      if (!isMatch) {
        return done(null, false, {
          error: 'Your login details could not be verified. Please try again.'
        });
      }

      return done(null, user);
    });
  });
}

function jwtStrategyHandler(payload, done) {
  models.UserModel.findById(payload._id, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
}


module.exports.verifyJwtToken = function (token) {
  if (token == null || (typeof token !== 'string')) return null;

  let t = token.substring(4);
  try {
    const decoded = jwtToken.verify(t, config.secrets.jwtSecret);
    return decoded;
  } catch (err) {
    console.log('jwt token verification failed');
    return null;
  }
};

// Middleware to require login/auth
module.exports.requireAuth = passport.authenticate('jwt', {
  session: false
});

module.exports.requireLogin = passport.authenticate('local', {
  session: false
});

module.exports.authorizeCurrentUser = function (req, res, next) {
  if (JSON.stringify(req.params.id) !== JSON.stringify(req.user._id)) {
    res.status(401)
      .json(new Status(401, 'not authorized'))
      .end();
  } else {
    next();
  }
};
