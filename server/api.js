import express from 'express';
import { addSession, getTasks, getTask , getServices, getVersions, deleteVersion , getVersionsForService } from './data';
import {refreshStore as googleRefreshTokenStore, accessStore as googleAccessTokenStore } from './google_token_store';
import {GCP_PROJECT_ID} from './secrets';

const router = express.Router();

// Middleware to get user's OAUTH tokens to use in GAPI call.
router.use('/', (req, res, next) => {
  if(!req.user || !req.user.id) {
    res.status(401).end();
    return;
    // TODO: Handle on client. Redirect or link to login.
  }
  if (!googleRefreshTokenStore.has(req.user.id)) {
    res.status(403).end();
    return;
    // TODO: Handle on client. Redirect or link to consent.
  }
  const refreshToken = googleRefreshTokenStore.get(req.user.id);
  res.locals.accessToken = googleAccessTokenStore.get(refreshToken);
  next();
});

router.post('/sessions', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || email === 'error') {
    res.statusMessage = 'Invalid email or password';
    res.status(401).end();
  } else {
    const name = email.split('@')[0].replace(/\.|_/, ' '); // simulated
    const now = new Date();
    const token = `token-${now.getTime()}`; // simulated
    const session = { email, name, token };
    addSession(token, session);
    res.json(session);
  }
});

router.get('/task', (req, res) => {
  getTasks(req.query).then(tasks => res.json(tasks));
});

router.get('/task/:id', (req, res) => {
  getTask(req.params.id).then((result) => {
    if (!result.task) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.get('/service', (req, res) => {
  const {accessToken} = res.locals;
  getServices(accessToken, GCP_PROJECT_ID).then((result) => {
    if (!result.services) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.get('/service/:serviceId/version', (req, res) => {
  const {accessToken} = res.locals;
  const serviceId = req.params.serviceId;
  getVersionsForService(accessToken, GCP_PROJECT_ID, serviceId).then((result) => {
    if (!result.versions) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.get('/version', (req, res) => {
  const {accessToken} = res.locals;
  getVersions(accessToken, GCP_PROJECT_ID).then((result) => {
    if (!result.versions) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.delete('/service/:serviceId/version/:versionId', (req, res) => {
  const { serviceId, versionId } = req.params;
  deleteVersion(serviceId, versionId).then((result) => {
    if (!result.version) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});


module.exports = router;
