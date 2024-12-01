const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const roles = require('../utils/roles');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name can't be empty"],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  password: {
    type: String,
    minlength: 8,
    required: [true, 'Password is required'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Passwords don't match",
    },
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: [roles.ADMIN, roles.USER, roles.EMPLOYEE, roles.COMPANY],
    default: roles.USER,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  accountConfirmToken: String,
  accountConfirmExpires: Date,
  accountActivateToken: String,
  accountActivateExpires: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000); // Subtract 1 second
  next();
});

userSchema.pre(/^find/, function (next) {
  // if ((this as any).skipMiddleware) {
  //   return next();
  // }
  // eslint-disable-next-line dot-notation
  if (this.getOptions()['excludeFromActiveFilter']) return next();
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.checkPassword = async function (
  inputPassword,
  userPassword,
) {
  return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.isPasswordChangedAfter = function (JwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );
    return changedTimestamp > JwtTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

userSchema.methods.createAccountActivateToken = function () {
  const activateToken = crypto.randomBytes(32).toString('hex');

  this.accountActivateToken = crypto
    .createHash('sha256')
    .update(activateToken)
    .digest('hex');
  this.accountActivateExpires = new Date(Date.now() + 10 * 60 * 1000);

  return activateToken;
};
userSchema.methods.createConfirmToken = function () {
  const confirmToken = crypto.randomBytes(32).toString('hex');

  this.accountConfirmToken = crypto
    .createHash('sha256')
    .update(confirmToken)
    .digest('hex');
  this.accountConfirmExpires = new Date(Date.now() + 10 * 60 * 1000);
  return confirmToken;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
