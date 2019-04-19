import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-boost';
import App from './components/App';
import { GRAPHQL_URI } from './Config';
import { Provider } from 'react-redux';
import store from './redux/redux';

const client = new ApolloClient({
  uri: GRAPHQL_URI,
})

ReactDOM.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>,
  </ApolloProvider>
  </Provider>,
  document.getElementById('root'));
