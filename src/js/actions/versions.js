import { VERSIONS_LOAD, VERSIONS_UNLOAD } from '../actions';
import { watchVersions, unwatchVersions } from '../api/versions';

export function loadVersions() {
  return dispatch => (
    watchVersions()
      .on('success',
        payload => {
          return dispatch({ type: VERSIONS_LOAD, payload })
        }
      )
      .on('error',
        payload => {
          return dispatch({ type: VERSIONS_LOAD, error: true, payload })
        }
      )
      .start()
  );
}

export function unloadVersions() {
  unwatchVersions();
  return { type: VERSIONS_UNLOAD };
}
