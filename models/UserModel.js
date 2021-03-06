'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

let Status = include('util/status');

let UserSchema = new Schema({
  profile: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    status: {
      type: String
    },
    authentication: {
      type: String,
      enum: ['Local', 'Facebook'],
      default: 'Local'
    }
  },
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: String
  }
});

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
  const user = this;
  const SALT_FACTOR = 5;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err);
    }

    cb(null, isMatch);
  });
};

module.exports.mongooseModel = mongoose.model('User', UserSchema);
let UserModel = module.exports.mongooseModel;

module.exports.register = function (obj, cb) {
  const email = obj.email;
  const firstName = obj.firstName;
  const lastName = obj.lastName;
  const password = obj.password;
  const authType = obj.authentication;
  const status = obj.status;

  if (!email) {
    return cb(new Status(422, 'Missing email'), null);
  }

  if (!firstName || !lastName) {
    return cb(new Status(422,
      firstName ? 'Missing lastName' : 'Missing firstName'));
  }

  if (!authType) {
    return cb(new Status(422, 'Missing authentication'));
  }

  if (authType === 'Local' && !password) {
    return cb(new Status(422, 'Missing password'));
  }

  UserModel.findOne({
      email: email
    },
    function (err, existingUser) {
      if (err) {
        return cb(new Status(500, 'Error during user lookup', err));
      }

      if (existingUser) {
        return cb(new Status(422, 'Email already in use'));
      }

      // If email is unique and password was provided, create account
      let user = new UserModel({
        email: email,
        password: authType === 'Local' ? password : null,
        profile: {
          firstName: firstName,
          lastName: lastName,
          status: status,
          authentication: authType
        }
      });

      user.save(function (err, user) {
        if (err) {
          return cb(new Status(500, 'Error saving user', err));
        }

        cb(new Status(201, 'All is well'), user);
      });
    });
};

/**
 * Assumes a flattened object with _id as a required field (so you have to
 * fetch a user before updating).  email is also required and the
 * email and id have to match.  Any other existing, non-null fields in the
 * input object will be used to update the user.  For now, email is not
 * updateable.
 *
 */
module.exports.update = function (obj, cb) {
  let _id = obj._id;
  UserModel.findOne({
    _id: _id
  }, function (err, User) {
    if (err || !User || User.email !== obj.email) {
      cb(new Status(500, 'Error finding user', err), null);
    } else {
      User.profile.firstName =
        obj.firstName ? obj.firstName : User.profile.firstName;
      User.profile.lastName =
        obj.lastName ? obj.lastName : User.profile.lastName;
      User.profile.status = obj.status ? obj.status : User.profile.status;
      User.save(function (err, user) {
        if (err || !User) {
          cb(new Status(500, 'Error updating user', err), null);
        } else {
          cb(new Status(200, 'All is well'), user);
        }
      });
    }
  });
};

module.exports.find = function (o) {
  return UserModel.find(o);
};

module.exports.remove = function (o) {
  return UserModel.remove(o);
};

module.exports.findByIdAndRemove = function (o, cb) {
  return UserModel.findByIdAndRemove(o, cb);
};

module.exports.findById = function (o, cb) {
  return UserModel.findById(o, cb);
};

module.exports.findOne = function (o, cb) {
  return UserModel.findOne(o, cb);
};
