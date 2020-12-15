const passport = require('passport');
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/userModel.js');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'auth/google/callback',
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log(profile);
        //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        //   });
      }
    )
  );
};
