import { PROJECTS_LOAD } from '../actions';
import { loadProjects as loadProjectsApi } from '../api/projects';

// eslint-disable-next-line import/prefer-default-export
export function loadProjects() {
  return dispatch => loadProjectsApi()
    .then(payload => dispatch({ type: PROJECTS_LOAD, payload }))
    .catch(payload => dispatch({ type: PROJECTS_LOAD, error: true, payload }));
}
