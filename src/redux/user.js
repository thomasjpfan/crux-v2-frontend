import { FIGSHARE_AUTH_STORAGE_KEY, CRUX_AUTH_STORAGE_KEY, USERNAME_STORAGE_KEY } from '../Config';

function logoutAction() {
  return { type: 'LOGOUT' }
}

function loginAction(figshareAccessToken, cruxJWTToken, username) {
  return {
    type: 'LOGIN',
    figshareAccessToken: figshareAccessToken,
    cruxJWTToken: cruxJWTToken,
    username: username,
  }
}

const saveUserState = store => next => action => {
  if (action.type === 'LOGIN') {
    localStorage.setItem(FIGSHARE_AUTH_STORAGE_KEY, action.figshareAccessToken)
    localStorage.setItem(CRUX_AUTH_STORAGE_KEY, action.cruxJWTToken)
    localStorage.setItem(USERNAME_STORAGE_KEY, action.username)
  } else if (action.type === 'LOGOUT') {
    localStorage.removeItem(FIGSHARE_AUTH_STORAGE_KEY)
    localStorage.removeItem(CRUX_AUTH_STORAGE_KEY)
    localStorage.removeItem(USERNAME_STORAGE_KEY)
  }
  return next(action)
}

const initialUserState = {
  figshareAccessToken: localStorage.getItem(FIGSHARE_AUTH_STORAGE_KEY),
  cruxJWTToken: localStorage.getItem(CRUX_AUTH_STORAGE_KEY),
  username: localStorage.getItem(USERNAME_STORAGE_KEY),
  loggedIn: (localStorage.getItem(USERNAME_STORAGE_KEY) !== 'undefined' && localStorage.getItem(USERNAME_STORAGE_KEY) !== null),
}

function user(state = initialUserState, action) {
  if (action.type === 'LOGIN') {
    return {
      figshareAccessToken: action.figshareAccessToken,
      cruxJWTToken: action.cruxJWTToken,
      username: action.username,
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
