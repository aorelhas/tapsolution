import passport from 'passport'
import User from '../models/userModel.js';

// @desc     Auth ith Google
// @route    GET /auth/google
// @access   Public

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};
