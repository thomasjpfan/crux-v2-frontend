let FIGSHARE_AUTH_STORAGE_KEY = 'figshare_auth_token'
let FIGSHARE_AUTH_STATE_STORAGE_KEY = 'figshare_auth_state'
let CRUX_AUTH_STORAGE_KEY = 'crux_auth_token'
let CRUX_USERNAME_STORAGE_KEY = 'crux_username'
let CRUX_UID_STORAGE_KEY = 'crux_uid'

let GRAPHQL_URI
let FIGSHARE_REDIRECT_URI
let FIGHSARE_CLIENT_ID
if (process.env.NODE_ENV === 'production') {
  GRAPHQL_URI = 'https://crux-v2-be.herokuapp.com/graphql'
  FIGSHARE_REDIRECT_URI = 'https://necrux.netlify.com/index.html/oauth/figshare'
  FIGHSARE_CLIENT_ID = '95bcd514ad63b7f7388c8d9d5d2a9822fbbbfb67'
} else {
  GRAPHQL_URI = 'http://localhost:8000/graphql'
  FIGSHARE_REDIRECT_URI = 'https://localhost:8443/oauth/figshare'
  FIGHSARE_CLIENT_ID = '070c07203c8d6c02b277ff961935395694a92d0b'
}

let FIGSHARE_AUTH_URL = `https://figshare.com/account/applications/authorize?client_id=${FIGHSARE_CLIENT_ID}&response_type=token&redirect_url=${FIGSHARE_REDIRECT_URI}`

export { GRAPHQL_URI, FIGSHARE_AUTH_STORAGE_KEY, FIGSHARE_REDIRECT_URI, CRUX_AUTH_STORAGE_KEY, CRUX_USERNAME_STORAGE_KEY, CRUX_UID_STORAGE_KEY, FIGSHARE_AUTH_STATE_STORAGE_KEY, FIGSHARE_AUTH_URL }
