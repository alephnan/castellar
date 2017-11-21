import express from 'express';
import { addSession, getTasks, getTask , getServices, getVersions, deleteVersion , getVersionsForService } from './data';

const router = express.Router();

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
  getServices().then((result) => {
    if (!result.services) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.get('/service/:serviceId/version', (req, res) => {
  const serviceId = req.params.serviceId;
  getVersionsForService(serviceId).then((result) => {
    if (!result.versions) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.get('/version', (req, res) => {
  getVersions().then((result) => {
    if (!result.versions) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

router.delete('/version/:id', (req, res) => {
  deleteVersion(req.params.id).then((result) => {
    if (!result.version) {
      res.status(404).end();
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
