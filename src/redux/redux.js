import { user, saveUserState } from './user'
import { combineReducers, createStore, applyMiddleware } from 'redux'

const reducer = combineReducers({
  user
})

export default createStore(
  reducer,
  applyMiddleware(saveUserState)
);
