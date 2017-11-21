import { headers, parseJSON } from './utils';


export function loadVersions() {
  const options = {
    headers: headers(),
    method: 'GET',
  };
  return fetch(`/api/version/`, options)
    .then(parseJSON);
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

export function loadVersionsForService(serviceId) {
  const options = {
    headers: headers(),
    method: 'GET',
  };

  return fetch(`/api/service/${serviceId}/version`, options)
    .then(parseJSON);
}