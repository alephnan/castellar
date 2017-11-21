import { headers, parseJSON } from './utils';

export function loadServices() {
  const options = {
    headers: headers(),
    method: 'GET',
  };
  return fetch(`/api/service/`, options)
    .then(parseJSON);
}