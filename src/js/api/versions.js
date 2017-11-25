import { headers, parseJSON } from './utils';


export function loadVersions() {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'same-origin',
  };
  return fetch(`/api/version/`, options)
    .then(parseJSON);
}

export function deleteVersion(serviceId, versionId) {
  const options = {
    headers: headers(),
    method: 'DELETE',
    body: JSON.stringify({ serviceId , versionId }),
    credentials: 'same-origin',
  };

  return fetch(`/api/service/${serviceId}/version/${versionId}`, options)
    .then(parseJSON);
}

export function loadVersionsForService(serviceId) {
  const options = {
    headers: headers(),
    method: 'GET',
    credentials: 'same-origin',
  };

  return fetch(`/api/service/${serviceId}/version`, options)
    .then(parseJSON);
}