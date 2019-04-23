import { FIGSHARE_AUTH_STORAGE_KEY, CRUX_AUTH_STORAGE_KEY, CRUX_USERNAME_STORAGE_KEY, CRUX_UID_STORAGE_KEY } from '../Config';

function logoutAction() {
  return { type: 'LOGOUT' }
}

function loginAction(figshareAccessToken, cruxJWTToken, username, cruxUID) {
  return {
    type: 'LOGIN',
    figshareAccessToken: figshareAccessToken,
    cruxJWTToken: cruxJWTToken,
    username: username,
    cruxUID: cruxUID,
  }
}

const saveUserState = store => next => action => {
  if (action.type === 'LOGIN') {
    localStorage.setItem(FIGSHARE_AUTH_STORAGE_KEY, action.figshareAccessToken)
    localStorage.setItem(CRUX_AUTH_STORAGE_KEY, action.cruxJWTToken)
    localStorage.setItem(CRUX_USERNAME_STORAGE_KEY, action.username)
    localStorage.setItem(CRUX_UID_STORAGE_KEY, action.cruxUID)
  } else if (action.type === 'LOGOUT') {
    localStorage.removeItem(FIGSHARE_AUTH_STORAGE_KEY)
    localStorage.removeItem(CRUX_AUTH_STORAGE_KEY)
    localStorage.removeItem(CRUX_USERNAME_STORAGE_KEY)
    localStorage.removeItem(CRUX_UID_STORAGE_KEY)
  }
  return next(action)
}

const initialUserState = {
  figshareAccessToken: localStorage.getItem(FIGSHARE_AUTH_STORAGE_KEY),
  cruxJWTToken: localStorage.getItem(CRUX_AUTH_STORAGE_KEY),
  username: localStorage.getItem(CRUX_USERNAME_STORAGE_KEY),
  cruxUID: localStorage.getItem(CRUX_UID_STORAGE_KEY),
  loggedIn: (localStorage.getItem(CRUX_USERNAME_STORAGE_KEY) !== null && localStorage.getItem(CRUX_USERNAME_STORAGE_KEY) !== 'undefined'),
}

function user(state = initialUserState, action) {
  if (action.type === 'LOGIN') {
    return {
      figshareAccessToken: action.figshareAccessToken,
      cruxJWTToken: action.cruxJWTToken,
      username: action.username,
      cruxUID: action.cruxUID,
      loggedIn: true,
    }
  } else if (action.type === 'LOGOUT') {
    return {
      loggedIn: false
    }
  }
  return state
}

export { logoutAction, loginAction, user, saveUserState };
