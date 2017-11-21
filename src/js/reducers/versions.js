import { VERSIONS_LOAD, VERSIONS_UNLOAD , VERSION_DELETE} from '../actions';
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
};


export default createReducer(initialState, handlers);