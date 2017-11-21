import { VERSIONS_LOAD, VERSIONS_UNLOAD , VERSION_DELETE , LOADED_VERSIONS_FOR_SERVICE , SERVICE_CHANGE , RESET_TOAST } from '../actions';
import { loadVersions as loadVersionsApi, watchVersions, unwatchVersions , deleteVersion as deleteVersionApi, loadVersionsForService as loadVersionsForServiceApi} from '../api/versions';

export function loadVersions() {
  return dispatch =>
    loadVersionsApi()
      .then(payload => {
        dispatch({ type: VERSIONS_LOAD, payload })
      })
      .catch(payload =>
        dispatch({ type: VERSIONS_LOAD, error: true, payload })
      )
}

export function unloadVersions() {
  unwatchVersions();
  return { type: VERSIONS_UNLOAD };
}


export function deleteVersion(id) {
  return dispatch => (
    deleteVersionApi(id)
      .then(payload => {
        dispatch({ type : RESET_TOAST });
        dispatch({ type: VERSION_DELETE, payload });
      })
      .catch(payload => {
        dispatch({ type: VERSION_DELETE, error: true, payload })
      })
  );
}


export function selectService(serviceId) {
  return dispatch => {
    dispatch({ type : SERVICE_CHANGE , payload: { serviceId }});
    loadVersionsForServiceApi(serviceId)
      .then(payload => {
        setTimeout(() => {
          dispatch({ type : LOADED_VERSIONS_FOR_SERVICE, payload: {...payload, serviceId}});
        }, 1*1000);
      })
      .catch(payload => {

      })
  }
}

export function resetToast() {
  return dispatch => {
    dispatch({ type : RESET_TOAST });
  }
}