// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

import {
  NAV_ACTIVATE,
  NAV_ENABLE,
  NAV_RESPONSIVE,
  PROJECTS_LOAD,
  PROJECT_SELECTION_CHANGE,
} from '../actions';

import { createReducer } from './utils';

const initialState = {
  active: true, // start with nav active
  enabled: true, // start with nav disabled
  responsive: 'multiple',
  items: [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/services', label: 'Services' },
    { path: '/versions', label: 'Versions' },
    { path: '/instances', label: 'Instances' },
  ],
  selectedProject: null,
};

const handlers = {
  [NAV_ACTIVATE]: (_, action) => (
    { active: action.active, activateOnMultiple: undefined }
  ),

  [NAV_ENABLE]: (_, action) => (
    { enabled: action.enabled }
  ),

  [NAV_RESPONSIVE]: (state, action) => {
    const result = { responsive: action.responsive };
    if (action.responsive === 'single' && state.active) {
      result.active = false;
      result.activateOnMultiple = true;
    } else if (action.responsive === 'multiple' && state.activateOnMultiple) {
      result.active = true;
    }
    return result;
  },
  [PROJECT_SELECTION_CHANGE]: (state, action) => ({
    selectedProject: action.payload.projectSelection,
  }),
  [PROJECTS_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      const projects = action.payload.projects;
      // Default to first project.
      const selectedProject = projects[0].projectId;
      return {
        selectedProject,
      };
    }
    return { error: action.payload };
  },

};

export default createReducer(initialState, handlers);
