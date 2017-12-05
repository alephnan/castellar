import express from 'express';
import passport from 'passport';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from './secrets';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { refreshStore as googleRefreshTokenStore, accessStore as googleAccessTokenStore } from './google_token_store';

const router = express.Router();

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: GOOGLE_REDIRECT_URI },
(accessToken, refreshToken, profile, cb) => {
  const googleId = profile.id;
  // Get new refresh token.
  if (!refreshToken && !googleRefreshTokenStore.has(googleId)) {
    return cb(null, false);
  }
  // Save refresh token.
  if (refreshToken) {
    googleRefreshTokenStore.set(googleId, refreshToken);
  } else {
    refreshToken = googleRefreshTokenStore.get(googleId);
  }
  googleAccessTokenStore.set(refreshToken, {
    accessToken,
    expiration: 'foo',
  });
  const user = { id: googleId };
  return cb(null, user);
}));
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
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
  passport.authenticate('google', { scope: scopes, accessType: 'offline' }),
  (req, res, next) => {
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }
    next();
  });


// Consent for a new refresh token.
router.get('/consent',
  passport.authenticate('google', { scope: scopes, accessType: 'offline', prompt: 'consent' }),
  (req, res, next) => {
    if (req.query.return) {
      req.session.oauth2return = req.query.return;
    }
    next();
  });

// Handler for google auth callback route depends on dev-environment.
const googleCallbackRouteHandler = ((isDev) => {
  // dev client runs on different localhost then dev server.
  const devClientPort = 3000;
  const redirectRelativePath = '/dashboard';
  // client and server on same port in production environment.
  const redirectPath = isDev ? `http://localhost:${devClientPort}${redirectRelativePath}` : redirectRelativePath;
  return (req, res) => {
    // const redirect = req.session.oauth2return || '/';
    delete req.session.oauth2return;
    // Successful authentication, redirect home.
    res.redirect(redirectPath);
  };
})(process.env.NODE_ENV === 'development');

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/consent' }),
  googleCallbackRouteHandler);


module.exports = router;
