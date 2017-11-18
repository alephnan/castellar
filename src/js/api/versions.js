import RequestWatcher from './request-watcher';

let protocol = 'ws:';
if (window.location.protocol === 'https:') {
  protocol = 'wss:';
}
const host = ((process.env.NODE_ENV === 'development') ?
  'localhost:8102' : `${window.location.host}`);
const webSocketUrl = `${protocol}//${host}`;

const socketWatcher = new RequestWatcher({ webSocketUrl });

let tasksWatcher;

export function watchVersions() {
  tasksWatcher = socketWatcher.watch('/api/version');
  return tasksWatcher;
}

export function unwatchVersions() {
  if (tasksWatcher) {
    tasksWatcher.stop();
  }
}

