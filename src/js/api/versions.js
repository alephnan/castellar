import RequestWatcher from './request-watcher';
import { headers, parseJSON } from './utils';

let protocol = 'ws:';
if (window.location.protocol === 'https:') {
  protocol = 'wss:';
}
const host = ((process.env.NODE_ENV === 'development') ?
  'localhost:8102' : `${window.location.host}`);
const webSocketUrl = `${protocol}//${host}`;

const socketWatcher = new RequestWatcher({ webSocketUrl });

let versionsWatcher;

export function watchVersions() {
  versionsWatcher = socketWatcher.watch('/api/version');
  return versionsWatcher;
}

export function unwatchVersions() {
  if (versionsWatcher) {
    versionsWatcher.stop();
  }
}

export function deleteVersion(id) {
  const options = {
    headers: headers(),
    method: 'DELETE',
    body: JSON.stringify({ id })
  };

  return fetch(`/api/version/${id}`, options)
    .then(parseJSON);
}
