import { SERVICES_LOAD } from '../actions';
import { createReducer } from './utils';

const initialState = {
  services: [],
};

const handlers = {
  [SERVICES_LOAD]: (state, action) => {
    if (!action.error) {
      action.payload.error = undefined;
      return action.payload;
    }
    return { error: action.payload };
  },
};


export default createReducer(initialState, handlers);