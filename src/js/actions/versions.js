import { VERSIONS_LOAD, VERSIONS_UNLOAD, VERSION_DELETE, LOADED_VERSIONS_FOR_SERVICE, SERVICE_SELECTION_CHANGE, RESET_TOAST } from '../actions';
import { loadVersions as loadVersionsApi, unwatchVersions, deleteVersion as deleteVersionApi, loadVersionsForService as loadVersionsForServiceApi } from '../api/versions';

export function loadVersions() {
  return dispatch =>
    loadVersionsApi()
      .then(payload => dispatch({ type: VERSIONS_LOAD, payload }))
      .catch(payload => dispatch({ type: VERSIONS_LOAD, error: true, payload }));
}

export function unloadVersions() {
  unwatchVersions();
  return { type: VERSIONS_UNLOAD };
}


export function deleteVersion(serviceId, versionId) {
  return dispatch => (
    deleteVersionApi(serviceId, versionId)
      .then((payload) => {
        dispatch({ type: RESET_TOAST });
        dispatch({ type: VERSION_DELETE, payload });
      })
      .catch((payload) => {
        dispatch({ type: VERSION_DELETE, error: true, payload });
      })
  );
}


export function selectService(serviceSelection) {
  return (dispatch) => {
    dispatch({ type: SERVICE_SELECTION_CHANGE, payload: { serviceSelection } });
    if (serviceSelection === '*') {
      // Load all versions.
      loadVersions()(dispatch);
    } else { // Load versions for specific service.
      const serviceId = serviceSelection;
      loadVersionsForServiceApi(serviceId)
        .then((payload) => {
          dispatch({ type: LOADED_VERSIONS_FOR_SERVICE, payload: { ...payload, serviceId } });
        })
        .catch(() => {});
    }
  };
}

export function resetToast() {
  return (dispatch) => {
    dispatch({ type: RESET_TOAST });
  };
}
