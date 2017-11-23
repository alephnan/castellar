import express from 'express';
import passport from 'passport';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI} from './secrets';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';

const router = express.Router();

console.log(GOOGLE_CLIENT_ID);
console.log(GOOGLE_CLIENT_ID);

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_REDIRECT_URI,
  },
  function(accessToken, refreshToken, profile, cb) {
    const user = {googleId: profile.id}
    return cb(null, user);
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.serializeUser(function(user, done) {
  done(null, user);
});

const ADMIN_API_SCOPES = [
  'https://www.googleapis.com/auth/appengine.admin',
  'https://www.googleapis.com/auth/cloud-platform',
];
const scopes = [
  'profile',
  ...ADMIN_API_SCOPES
];

router.get('/google',
  passport.authenticate('google', { scope: [] }), 
  (req, res, next) => {
    console.log('return' + req.query.return);
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }  
    next();
  });

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    // Successful authentication, redirect home.
    res.redirect('/dashboard');
  });

module.exports = router;