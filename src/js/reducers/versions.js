import { VERSIONS_LOAD, VERSIONS_UNLOAD, VERSION_DELETE, LOADED_VERSIONS_FOR_SERVICE, SERVICE_SELECTION_CHANGE, RESET_TOAST } from '../actions';
import { createReducer } from './utils';

const initialState = {
  versions: [],
  version: undefined,
  selectedService: '*',
  loadingVersionsForService: true,
};

const handlers = {
  [VERSIONS_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return {
        versions: action.payload.versions,
        loadingVersionsForService: false,
      };
    }
    return { error: action.payload };
  },
  [VERSIONS_UNLOAD]: () => initialState,
  [VERSION_DELETE]: (state, action) => {
    if (action.error) {
      return { error: action.payload };
    }
    const { versions } = state;
    const deletedId = action.payload.version.id;
    return {
      versions: versions.filter(({ id }) => id !== deletedId),
      toastMessageDeletedVersionId: deletedId,
    };
  },
  [LOADED_VERSIONS_FOR_SERVICE]: (state, action) => {
    if (action.error) {
      return { error: action.payload };
    }
    return {
      versions: action.payload.versions,
      loadingVersionsForService: false,
    };
  },
  [SERVICE_SELECTION_CHANGE]: (state, action) => ({
    selectedService: action.payload.serviceSelection,
    loadingVersionsForService: true,
  }),
  [RESET_TOAST]: () => ({
    toastMessageDeletedVersionId: undefined
  }),
};


export default createReducer(initialState, handlers);
