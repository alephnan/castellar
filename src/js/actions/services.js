import { SERVICES_LOAD } from '../actions';
import { loadServices as loadServicesApi } from '../api/services';

export function loadServices() {
  return dispatch =>
    loadServicesApi()
      .then(payload => {
        setTimeout(() => {
          dispatch({ type: SERVICES_LOAD, payload })
        }, 2*1000);
      })
      .catch(payload =>
        dispatch({ type: SERVICES_LOAD, error: true, payload })
      )
}

