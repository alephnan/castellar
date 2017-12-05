import { headers, parseJSON } from './utils';

// eslint-disable-next-line import/prefer-default-export
export function loadServices() {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'same-origin',
  };
  return fetch('/api/service/', options)
    .then(parseJSON);
}
