// Importing Passport, strategies, and config
const passport = require('passport');
const User = require('../models/user');
const config = require('./main');
const JwtStrategy = require('passport-jwt')
  .Strategy;
const ExtractJwt = require('passport-jwt')
  .ExtractJwt;
const LocalStrategy = require('passport-local');

const localOptions = {
  usernameField: 'email'
};

const localLogin = new LocalStrategy(localOptions, localStrategyHadler);
const jwtLogin = new JwtStrategy(jwtOptions, jwtLoginHandler);

passport.use(jwtLogin);
passport.use(localLogin);

function localStrategyHandler(email, password, done) {
  User.findOne({
    email: email
  }, localLoginHandler)
});

function localLoginHandler(err, user) {
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
        error: "Your login details could not be verified. Please try again."
      });
    }

    return done(null, user);
  });
}

// Setting up JWT login strategy

const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secret
};


function jwtLoginHandler(payload, done) {
  User.findById(payload._id, function (err, user) {
    if (err) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});
