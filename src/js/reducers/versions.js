import { VERSIONS_LOAD, VERSIONS_UNLOAD } from '../actions';
import { createReducer } from './utils';

const initialState = {
  versions: [],
  version: undefined
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
};

export default createReducer(initialState, handlers);