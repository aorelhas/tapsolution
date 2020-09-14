const mongoose = require('mongoose');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { timeStamp } = require('console');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
    },
    hashed_password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    history: {
      type: Array,
      default: [],
    },
  },
  { timeStamps: true }
);

// Virtual Fields

userSchema
  .virtual('password')
  .set(() => {
    this._password = password;
    this.salt = uuidv4();
    this.hashed_password = this.encryptedPassword(password);
  })
  .get(() => {
    return this._password;
  });

userSchema.methods = {
  encryptedPassword: (password) => {
    if (!password) return '';

    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      return '';
    }
  },
};

module.exports = mongoose.model('User', userSchema);
