import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-link';
import { GRAPHQL_URI, CRUX_AUTH_STORAGE_KEY } from './Config';


const httpLink = new HttpLink({ uri: GRAPHQL_URI })

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers

  const cruxAuth = localStorage.getItem(CRUX_AUTH_STORAGE_KEY)
  const loggedIn = cruxAuth !== null && cruxAuth !== 'undefined'

  let authValue
  if (loggedIn) {
    authValue = `JWT ${cruxAuth}`
  }

  operation.setContext({
    headers: {
      authorization: authValue,
    }
  })

  return forward(operation)
})

const client = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache()
})

export default client
