let FIGSHARE_AUTH_STORAGE_KEY = 'figshare_auth_token'
let FIGSHARE_AUTH_STATE_STORAGE_KEY = 'figshare_auth_state'
let CRUX_AUTH_STORAGE_KEY = 'crux_auth_token'
let USERNAME_STORAGE_KEY = 'username'


let GRAPHQL_URI
let FIGSHARE_REDIRECT_URI
if (process.env.NODE_ENV === 'production') {
  GRAPHQL_URI = 'https://wow.com'
  FIGSHARE_REDIRECT_URI = 'https://wow.com/oauth/figshare'
} else {
  GRAPHQL_URI = 'http://localhost:8000/graphql'
  FIGSHARE_REDIRECT_URI = 'https://localhost:8443/oauth/figshare'
}

let FIGSHARE_AUTH_URL = `https://figshare.com/account/applications/authorize?client_id=070c07203c8d6c02b277ff961935395694a92d0b&response_type=token&redirect_url=${FIGSHARE_REDIRECT_URI}`

export { GRAPHQL_URI, FIGSHARE_AUTH_STORAGE_KEY, FIGSHARE_REDIRECT_URI, CRUX_AUTH_STORAGE_KEY, USERNAME_STORAGE_KEY, FIGSHARE_AUTH_STATE_STORAGE_KEY, FIGSHARE_AUTH_URL }
