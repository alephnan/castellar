import { SERVICES_LOAD } from '../actions';
import { loadServices as loadServicesApi } from '../api/services';

// eslint-disable-next-line import/prefer-default-export
export function loadServices() {
  return dispatch => loadServicesApi()
    .then(payload => dispatch({ type: SERVICES_LOAD, payload }))
    .catch(payload => dispatch({ type: SERVICES_LOAD, error: true, payload }));
}
