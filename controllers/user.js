const User = require('../models/User');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const validator = require('validator');
const flash = require('flash');
const { errorHandler } = require('../helpers/dbErrorHandler');

/**
 * POST /login
 * Sign in using email and password.
 */
exports.signin = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    });
  })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.signup = (req, res, next) => {
  const validationErrors = [];
  if (!validator.isEmail(req.body.email))
    validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (!validator.isLength(req.body.password, { min: 8 }))
    validationErrors.push({
      msg: 'Password must be at least 8 characters long',
    });
  if (req.body.password !== req.body.confirmPassword)
    validationErrors.push({ msg: 'Passwords do not match' });

  if (validationErrors.length) {
    // req.flash('errors', validationErrors);
    return res.redirect('/signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      req.flash('errors', {
        msg: 'Account with that email address already exists.',
      });
      return res.redirect('/signup');
    }
    user.save((err) => {
      if (err) {
        return next(err);
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect('/');
      });
    });
  });
};
