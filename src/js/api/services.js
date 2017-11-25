import { headers, parseJSON } from './utils';

export function loadServices() {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'same-origin',
  };
  return fetch(`/api/service/`, options)
    .then(parseJSON);
}