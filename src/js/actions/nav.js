import {
  NAV_ACTIVATE,
  NAV_ENABLE,
  NAV_RESPONSIVE,
  PROJECT_SELECTION_CHANGE,
} from '../actions';

export function navActivate(active) {
  return { type: NAV_ACTIVATE, active };
}

export function navEnable(enabled) {
  return { type: NAV_ENABLE, enabled };
}

export function navResponsive(responsive) {
  return { type: NAV_RESPONSIVE, responsive };
}

export function selectProject(projectSelection) {
  return (dispatch) => {
    dispatch({ type: PROJECT_SELECTION_CHANGE, payload: { projectSelection } });
    // TODO: load service and versions for this service
  };
}
