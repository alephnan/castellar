import { VERSIONS_LOAD, VERSIONS_UNLOAD , VERSION_DELETE } from '../actions';
import { loadVersions as loadVersionsApi, watchVersions, unwatchVersions , deleteVersion as deleteVersionApi} from '../api/versions';

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
        dispatch({ type: VERSION_DELETE, payload });
      })
      .catch(payload => {
        dispatch({ type: VERSION_DELETE, error: true, payload })
      })
  );
}
