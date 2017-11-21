import { VERSIONS_LOAD, VERSIONS_UNLOAD , VERSION_DELETE, LOADED_VERSIONS_FOR_SERVICE, SERVICE_CHANGE } from '../actions';
import { createReducer } from './utils';

const initialState = {
  versions: [],
  version: undefined,
  selectedService: 'default',
  loadingVersionsForService: false,
};

const handlers = {
  [VERSIONS_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
  [VERSIONS_UNLOAD]: () => initialState,
  [VERSION_DELETE]: (state, action) => {
    if(action.error) {
      return { error: action.payload}
    }
    const {versions} = state;
    const deletedId = action.payload.version.id;
    return {
      versions: versions.filter(({id}) => id !== deletedId)
    }
  },
  [LOADED_VERSIONS_FOR_SERVICE]: (state, action) => {
    if(action.error) {
      return { error: action.payload};
    }
    return {
      versions: action.payload.versions,
      loadingVersionsForService: false,
    }
  },
  [SERVICE_CHANGE]: (state, action) => {
    return {
      selectedService: action.payload.serviceId,
      loadingVersionsForService: true,
    }
  },
};


export default createReducer(initialState, handlers);