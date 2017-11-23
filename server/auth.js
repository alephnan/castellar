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
  passport.authenticate('google', { scope: scopes }), 
  (req, res, next) => {
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }  
    next();
  });



// Handler for google auth callback route depends on dev-environment.
const googleCallbackRouteHandler = (function(isDev) {
  // dev client runs on different localhost then dev server.
  const devClientPort = 3000;
  const redirectRelativePath = '/dashboard';
  // client and server on same port in production environment.
  const redirectPath = isDev ? `http://localhost:${devClientPort}${redirectRelativePath}` : redirectRelativePath;
  return function(req, res) {
    const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    // Successful authentication, redirect home.
    res.redirect(redirectPath);
  };
})(process.env.NODE_ENV == 'development');

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallbackRouteHandler);


module.exports = router;