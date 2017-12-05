import { combineReducers } from 'redux';

import dashboard from './dashboard';
import nav from './nav';
import projects from './projects';
import services from './services';
import session from './session';
import tasks from './tasks';
import versions from './versions';

export default combineReducers({
  dashboard,
  nav,
  projects,
  services,
  session,
  tasks,
  versions,
});
