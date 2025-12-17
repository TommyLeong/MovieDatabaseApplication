import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

// Create Redux store with Thunk middleware
const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export default store;
