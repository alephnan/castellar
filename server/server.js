import compression from 'compression';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import api from './api';
import auth from './auth';
import { addNotifier, getTasks, getTask } from './data';
import Notifier from './notifier';
import passport from 'passport';


const PORT = process.env.PORT || 8102;

const notifier = new Notifier();

addNotifier(
  'task',
  (task) => {
    // this can be invoked multiple times as new requests happen
    notifier.test((request) => {
      // we should skip notify if the id of the task does not match the payload
      if (request.path === '/api/task/:id' && request.params.id !== task.id) {
        return false;
      }
      return true;
    });
  }
);

notifier.use('/api/task', () => getTasks());
notifier.use('/api/task/:id', param => (
  getTask(param.id).then((result) => {
    if (!result.task) {
      return Promise.reject({ statusCode: 404, message: 'Not Found' });
    }
    return Promise.resolve(result);
  })
));

const app = express()
  .use(compression())
  .use(cookieParser()) // TODO: Need to use same secret as session?
  .use(morgan('tiny'))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({
    extended: true
  }))
  // TODO: use CORS
  // TODO: re-evaluate this configuration.
  .use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: true,
  }));

// Authentication
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', auth);

// REST API
app.use('/api', api);

// UI
app.use('/', express.static(path.join(__dirname, '/../dist')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(path.join(__dirname, '/../dist/index.html')));
});

const server = http.createServer(app);
server.listen(PORT);
notifier.listen(server);

console.log(`Server started at http://localhost:${PORT}`);
